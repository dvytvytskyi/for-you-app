import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AdminPanelClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ADMIN_PANEL_API_URL || 'http://localhost:4000/api',
      headers: {
        'X-API-Key': process.env.ADMIN_PANEL_API_KEY || 'your-secure-api-key-for-main-backend',
      },
    });
  }

  async getProperties(filters?: any) {
    try {
      const { data } = await this.client.get('/properties', { params: filters });
      return data.data;
    } catch (error) {
      console.error('Error fetching properties from Admin Panel:', error);
      return [];
    }
  }

  async getPropertyById(id: string) {
    try {
      const { data } = await this.client.get(`/properties/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching property from Admin Panel:', error);
      return null;
    }
  }

  async getCourses() {
    try {
      const { data } = await this.client.get('/courses');
      return data.data;
    } catch (error) {
      console.error('Error fetching courses from Admin Panel:', error);
      return [];
    }
  }

  async getCourseById(id: string) {
    try {
      const { data } = await this.client.get(`/courses/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching course from Admin Panel:', error);
      return null;
    }
  }

  async getNews() {
    try {
      const { data } = await this.client.get('/news');
      return data.data;
    } catch (error) {
      console.error('Error fetching news from Admin Panel:', error);
      return [];
    }
  }

  async getNewsById(id: string) {
    try {
      const { data } = await this.client.get(`/news/${id}`);
      return data.data;
    } catch (error) {
      console.error('Error fetching news from Admin Panel:', error);
      return null;
    }
  }

  async getSettings() {
    try {
      const countries = await this.client.get('/settings/countries');
      const facilities = await this.client.get('/settings/facilities');
      const developers = await this.client.get('/settings/developers');
      return {
        countries: countries.data.data,
        facilities: facilities.data.data,
        developers: developers.data.data,
      };
    } catch (error) {
      console.error('Error fetching settings from Admin Panel:', error);
      return { countries: [], facilities: [], developers: [] };
    }
  }

  async createSupportRequest(data: any) {
    try {
      const response = await this.client.post('/support', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating support request in Admin Panel:', error);
      return null;
    }
  }
}

