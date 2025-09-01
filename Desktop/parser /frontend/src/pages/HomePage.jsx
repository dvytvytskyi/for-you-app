import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { loadProjects } from '../utils/dataLoader';
import StatsCard from '../components/StatsCard';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await loadProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProjects: projects.length,
    locations: new Set(projects.map(p => p.location).filter(Boolean)).size,
    totalUnits: projects.reduce((sum, p) => sum + (p.total_units || 0), 0),
    totalMedia: projects.reduce((sum, p) => sum + (p.total_media || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Azul Developments Analytics
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive project management and analytics dashboard for real estate developments
        </p>
        
        {/* AI Enhanced Project Button */}
        <div className="mt-8">
          <Link
            to="/imagine-by-marein"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">🤖</span>
            View AI-Enhanced Project: Imagine by Marein
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            83 AI-analyzed images • 34 renders • 30 plans • 13 quality specs • 6 price docs
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building}
          title="Total Projects"
          value={stats.totalProjects}
          color="blue"
        />
        <StatsCard
          icon={MapPin}
          title="Locations"
          value={stats.locations}
          color="green"
        />
        <StatsCard
          icon={Users}
          title="Total Units"
          value={stats.totalUnits}
          color="purple"
        />
        <StatsCard
          icon={Calendar}
          title="Media Files"
          value={stats.totalMedia}
          color="orange"
        />
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Projects ({filteredProjects.length})
          </h2>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'No projects found matching your search.' : 'No projects available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Link
                key={index}
                to={`/project/${project.id || project.name?.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {project.location}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {project.total_units && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{project.total_units} units</span>
                    </div>
                  )}
                  {project.total_media && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{project.total_media} media files</span>
                    </div>
                  )}
                  {project.price_from && (
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">
                        From {project.price_from}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Click to view details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
