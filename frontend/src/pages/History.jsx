import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { 
  Activity, 
  Clock, 
  ChevronRight,
  Trash2,
  Filter,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, riskFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (riskFilter) params.riskLevel = riskFilter;
      
      const response = await analysisAPI.getHistory(params);
      if (response.data.success) {
        setAnalyses(response.data.analyses);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await analysisAPI.deleteAnalysis(id);
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Analysis History</h1>
            <p className="text-slate-600 mt-2">View and manage your past health analyses</p>
          </div>
          
          <Link
            to="/analyze"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            New Analysis
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600">Filter by risk level:</span>
            <div className="flex gap-2">
              {[
                { value: '', label: 'All' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setRiskFilter(filter.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    riskFilter === filter.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="large" />
          </div>
        ) : analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id}
                className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Link to={`/results/${analysis.id}`} className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center">
                        <Activity className="w-7 h-7 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {analysis.symptoms?.map(s => s.name).slice(0, 2).join(', ')}
                          {analysis.symptoms?.length > 2 && ` +${analysis.symptoms.length - 2} more`}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(analysis.riskLevel)}`}>
                            {analysis.riskLevel}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{analysis.healthScore}</div>
                      <div className="text-xs text-slate-500">Score</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/results/${analysis.id}`}
                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(analysis.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, page })}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                      pagination.page === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No analyses yet</h3>
            <p className="text-slate-500 mb-6">Start by analyzing your symptoms</p>
            <Link
              to="/analyze"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Start Analysis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
