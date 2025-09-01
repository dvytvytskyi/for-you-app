import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ImagineByMarein = () => {
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('/imagine-by-marein.json')
      .then(response => response.json())
      .then(data => setProjectData(data))
      .catch(error => console.error('Error loading project data:', error));
  }, []);

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Imagine by Marein...</p>
        </div>
      </div>
    );
  }

  const { project_info, description, renders, plans, qualities, prices, statistics } = projectData;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'renders', name: 'Renders', icon: '🎨', count: renders.summary.total_count },
    { id: 'plans', name: 'Plans', icon: '📐', count: plans.summary.total_count },
    { id: 'qualities', name: 'Qualities', icon: '📋', count: qualities.summary.total_count },
    { id: 'prices', name: 'Prices', icon: '💰', count: prices.summary.total_count },
  ];

  const renderImageCard = (item, type) => {
    const aiAnalysis = item.ai_analysis?.analysis;
    let parsedAnalysis = {};
    
    try {
      // Extract JSON from the analysis string
      const jsonMatch = aiAnalysis.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[1]);
      }
    } catch (e) {
      parsedAnalysis = { overall_impression: aiAnalysis };
    }

    return (
      <motion.div
        key={item.filename}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <img
            src={`/downloaded_files/${type}/${item.filename}`}
            alt={item.filename}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => setSelectedImage(item)}
          />
          <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs">
            AI Analyzed
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 truncate">
            {item.filename.replace('.jpg', '').replace(/_/g, ' ')}
          </h3>
          
          {parsedAnalysis.room_area_type && (
            <p className="text-sm text-indigo-600 mb-2">
              {parsedAnalysis.room_area_type}
            </p>
          )}
          
          {parsedAnalysis.key_features && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {parsedAnalysis.key_features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {parsedAnalysis.overall_impression && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {parsedAnalysis.overall_impression}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Project Header */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{project_info.name}</h1>
          <p className="text-xl text-indigo-600 mb-4">{project_info.location}</p>
          <div className="text-3xl font-bold text-green-600 mb-4">{project_info.price_range}</div>
          <p className="text-gray-600">{project_info.units} {project_info.type}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Features</h3>
            <ul className="space-y-2">
              {description.key_features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Amenities</h3>
            <ul className="space-y-2">
              {description.amenities.map((amenity, idx) => (
                <li key={idx} className="flex items-center text-gray-600">
                  <span className="text-blue-500 mr-2">📍</span>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Project Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{statistics.total_processed}</div>
            <div className="text-sm text-gray-600">AI Analyzed Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.villa_types}</div>
            <div className="text-sm text-gray-600">Villa Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.render_types}</div>
            <div className="text-sm text-gray-600">Render Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics.quality_pages}</div>
            <div className="text-sm text-gray-600">Quality Pages</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderImageGrid = (items, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.documents.map((item, index) => (
        <motion.div
          key={item.filename}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderImageCard(item, type)}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">Imagine by Marein</h1>
            <div className="text-sm text-gray-600">
              AI Processed: {project_info?.ai_processed_at}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'renders' && renderImageGrid(renders, 'render')}
        {activeTab === 'plans' && renderImageGrid(plans, 'plan')}
        {activeTab === 'qualities' && renderImageGrid(qualities, 'quality')}
        {activeTab === 'prices' && renderImageGrid(prices, 'price')}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedImage.filename}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <img
                src={`/downloaded_files/${selectedImage.type}/${selectedImage.filename}`}
                alt={selectedImage.filename}
                className="w-full rounded-lg"
              />
              {selectedImage.ai_analysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Analysis</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedImage.ai_analysis.analysis}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagineByMarein;
