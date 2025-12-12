const axios = require('axios');
const { Client } = require('pg');

async function syncAll() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'for_you_real_estate',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // 1. Отримати токен з БД
    const tokenResult = await client.query('SELECT "accessToken" FROM amo_tokens LIMIT 1');
    const accessToken = tokenResult.rows[0]?.accessToken;

    if (!accessToken) {
      console.log('ERROR: No access token found');
      await client.end();
      return;
    }

    console.log('Token found, starting sync...');

    // 2. Синхронізувати pipelines
    try {
      const pipelinesRes = await axios.get('https://reforyou.amocrm.ru/api/v4/leads/pipelines', {
        headers: { Authorization: 'Bearer ' + accessToken },
      });

      const pipelines = pipelinesRes.data._embedded?.pipelines || [];
      console.log('Pipelines found:', pipelines.length);

      for (const pipeline of pipelines) {
        await client.query(
          `INSERT INTO amo_pipelines (id, name, sort, "isMain", "isUnsortedOn", "accountId")
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             sort = EXCLUDED.sort,
             "isMain" = EXCLUDED."isMain",
             "isUnsortedOn" = EXCLUDED."isUnsortedOn"`,
          [pipeline.id, pipeline.name, pipeline.sort, pipeline.is_main, pipeline.is_unsorted_on, '31920194'],
        );

        // Синхронізувати stages
        if (pipeline._embedded?.statuses) {
          for (const status of pipeline._embedded.statuses) {
            await client.query(
              `INSERT INTO amo_stages (id, "pipelineId", name, sort, "isEditable", color)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 sort = EXCLUDED.sort,
                 "isEditable" = EXCLUDED."isEditable",
                 color = EXCLUDED.color`,
              [status.id, pipeline.id, status.name, status.sort, status.is_editable, status.color || null],
            );
          }
          console.log(`  - Stages synced for pipeline ${pipeline.id}: ${pipeline._embedded.statuses.length}`);
        }
      }

      console.log('✅ Pipelines and stages synced successfully!');
    } catch (error) {
      console.log('ERROR syncing pipelines:', error.response?.data || error.message);
    }

    // 3. Синхронізувати leads
    try {
      let allLeads = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const leadsRes = await axios.get('https://reforyou.amocrm.ru/api/v4/leads', {
          headers: { Authorization: 'Bearer ' + accessToken },
          params: { limit: 250, page: page },
        });

        const leads = leadsRes.data._embedded?.leads || [];
        if (leads.length === 0) {
          hasMore = false;
        } else {
          allLeads = allLeads.concat(leads);
          page++;
          if (leads.length < 250) hasMore = false;
        }
      }

      console.log('Leads found:', allLeads.length);

      let synced = 0;
      let errors = 0;

      for (const lead of allLeads) {
        try {
          // Екрануємо назву для безпеки
          const leadName = (lead.name || 'Lead from AMO').replace(/'/g, "''");
          
          await client.query(
            `INSERT INTO leads ("amoLeadId", "guestName", status, "responsibleUserId")
             VALUES ($1, $2, $3, $4)
             ON CONFLICT ("amoLeadId") DO UPDATE SET
               "guestName" = EXCLUDED."guestName",
               status = EXCLUDED.status,
               "responsibleUserId" = EXCLUDED."responsibleUserId"`,
            [lead.id, leadName, 'NEW', lead.responsible_user_id || null],
          );
          synced++;
        } catch (err) {
          console.log(`Error importing lead ${lead.id}:`, err.message);
          errors++;
        }
      }

      console.log(`✅ Leads synced: ${synced} successful, ${errors} errors`);
    } catch (error) {
      console.log('ERROR syncing leads:', error.response?.data || error.message);
    }

    await client.end();
    console.log('✅ Sync completed!');
  } catch (error) {
    console.error('Fatal error:', error);
    await client.end();
  }
}

syncAll();

