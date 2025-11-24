import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, Briefcase, Calendar, TrendingUp, Search, Filter, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminView = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalServices: 0,
    totalBookings: 0
  });
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // users, providers, bookings
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const usersList = profiles.filter(p => p.role === 'user');
      const providersList = profiles.filter(p => p.role === 'provider');

      setUsers(usersList);
      setProviders(providersList);

      // Fetch services count
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id');

      // Fetch bookings count
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id');

      setStats({
        totalUsers: usersList.length,
        totalProviders: providersList.length,
        totalServices: services?.length || 0,
        totalBookings: bookings?.length || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = (data, filename) => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Location', 'Created At'],
      ...data.map(item => [
        item.full_name || '',
        item.email || '',
        item.phone || '',
        item.location || '',
        new Date(item.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="animate-spin" style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid var(--md-sys-color-surface-variant)', 
          borderTopColor: 'var(--md-sys-color-primary)', 
          borderRadius: '50%' 
        }}></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="headline-large" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
          Admin Dashboard
        </h1>
        <p className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          View and manage users, providers, and platform statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <Card className="card-hover" variant="filled" style={{ 
          background: 'linear-gradient(135deg, #EADDFF 0%, #D0BCFF 100%)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p className="label-large" style={{ color: 'var(--md-sys-color-on-primary-container)', marginBottom: '0.5rem' }}>
                Total Users
              </p>
              <h2 className="headline-medium" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                {stats.totalUsers}
              </h2>
            </div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'rgba(103, 80, 164, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} color="var(--md-sys-color-primary)" />
            </div>
          </div>
        </Card>

        <Card className="card-hover" variant="filled" style={{ 
          background: 'linear-gradient(135deg, #FFD8E4 0%, #FFC2D1 100%)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p className="label-large" style={{ color: 'var(--md-sys-color-on-tertiary-container)', marginBottom: '0.5rem' }}>
                Total Providers
              </p>
              <h2 className="headline-medium" style={{ fontWeight: 700, color: 'var(--md-sys-color-tertiary)' }}>
                {stats.totalProviders}
              </h2>
            </div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'rgba(125, 82, 96, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Briefcase size={24} color="var(--md-sys-color-tertiary)" />
            </div>
          </div>
        </Card>

        <Card className="card-hover" variant="filled" style={{ 
          background: 'linear-gradient(135deg, #C7F9CC 0%, #B3F5BC 100%)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p className="label-large" style={{ marginBottom: '0.5rem', color: '#0D5229' }}>
                Total Services
              </p>
              <h2 className="headline-medium" style={{ fontWeight: 700, color: '#10B981' }}>
                {stats.totalServices}
              </h2>
            </div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#10B981" />
            </div>
          </div>
        </Card>

        <Card className="card-hover" variant="filled" style={{ 
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p className="label-large" style={{ marginBottom: '0.5rem', color: '#92400E' }}>
                Total Bookings
              </p>
              <h2 className="headline-medium" style={{ fontWeight: 700, color: '#F59E0B' }}>
                {stats.totalBookings}
              </h2>
            </div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={24} color="#F59E0B" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ 
        borderBottom: '1px solid var(--md-sys-color-outline-variant)', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        gap: '2rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 0',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'users' ? '3px solid var(--md-sys-color-primary)' : 'none',
            color: activeTab === 'users' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            fontWeight: activeTab === 'users' ? 600 : 400,
            whiteSpace: 'nowrap'
          }}
          className="title-medium"
        >
          Users ({stats.totalUsers})
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          style={{
            padding: '12px 0',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'providers' ? '3px solid var(--md-sys-color-primary)' : 'none',
            color: activeTab === 'providers' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            fontWeight: activeTab === 'providers' ? 600 : 400,
            whiteSpace: 'nowrap'
          }}
          className="title-medium"
        >
          Providers ({stats.totalProviders})
        </button>
      </div>

      {/* Search & Actions */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--md-sys-color-on-surface-variant)'
            }} 
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              border: '1px solid var(--md-sys-color-outline)',
              outline: 'none',
              fontSize: '14px'
            }}
            className="body-medium"
          />
        </div>
        <Button 
          variant="outlined" 
          onClick={() => exportToCSV(
            activeTab === 'users' ? filteredUsers : filteredProviders,
            `${activeTab}_export.csv`
          )}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} />
          Export CSV
        </Button>
      </div>

      {/* Users/Providers Table */}
      <Card variant="outlined" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                borderBottom: '1px solid var(--md-sys-color-outline-variant)'
              }}>
                <th style={{ padding: '12px', textAlign: 'left' }} className="label-large">Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }} className="label-large">Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }} className="label-large">Phone</th>
                <th style={{ padding: '12px', textAlign: 'left' }} className="label-large">Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }} className="label-large">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'users' ? filteredUsers : filteredProviders).map((person) => (
                <tr 
                  key={person.id}
                  style={{ 
                    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--md-sys-color-primary-container), var(--md-sys-color-tertiary-container))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        color: 'var(--md-sys-color-primary)'
                      }}>
                        {(person.full_name || 'U')[0].toUpperCase()}
                      </div>
                      <span className="body-medium" style={{ fontWeight: 500 }}>
                        {person.full_name || 'No name'}
                      </span>
                    </div>
                  </td>
                  <td className="body-small" style={{ padding: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {person.email}
                  </td>
                  <td className="body-small" style={{ padding: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {person.phone || '-'}
                  </td>
                  <td className="body-small" style={{ padding: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {person.location || '-'}
                  </td>
                  <td className="body-small" style={{ padding: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {new Date(person.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(activeTab === 'users' ? filteredUsers : filteredProviders).length === 0 && (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center',
              color: 'var(--md-sys-color-on-surface-variant)'
            }}>
              <p className="body-large">No {activeTab} found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminView;
