import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Star,
    Download,
    BarChart as BarChartIcon,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../ui/Card';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ProviderAnalytics = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState({
        totalEarnings: 0,
        monthlyEarnings: 0,
        totalBookings: 0,
        completedBookings: 0,
        averageRating: 0,
        revenueByMonth: [],
        bookingsByService: [],
        revenueByService: [],
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days

    useEffect(() => {
        if (user) {
            fetchAnalytics();
        }
    }, [user, dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(dateRange));

            // Fetch bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    service:services(title, price)
                `)
                .eq('provider_id', user.id)
                .gte('created_at', startDate.toISOString());

            if (bookingsError) throw bookingsError;

            // Fetch reviews
            const { data: reviews, error: reviewsError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('provider_id', user.id);

            if (reviewsError) throw reviewsError;

            // Calculate analytics
            const totalEarnings = bookings
                .filter((b) => b.status === 'completed')
                .reduce((sum, b) => sum + (b.total_price || 0), 0);

            const monthlyEarnings = bookings
                .filter((b) => {
                    const bookingDate = new Date(b.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return b.status === 'completed' && bookingDate >= thirtyDaysAgo;
                })
                .reduce((sum, b) => sum + (b.total_price || 0), 0);

            const averageRating =
                reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : 0;

            // Revenue by month (last 6 months)
            const monthlyData = {};
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthKey = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
                monthlyData[monthKey] = 0;
            }

            bookings
                .filter((b) => b.status === 'completed')
                .forEach((booking) => {
                    const bookingDate = new Date(booking.created_at);
                    const monthKey = bookingDate.toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                    });
                    if (monthlyData.hasOwnProperty(monthKey)) {
                        monthlyData[monthKey] += booking.total_price || 0;
                    }
                });

            const revenueByMonth = Object.entries(monthlyData).map(([month, revenue]) => ({
                month,
                revenue,
            }));

            // Bookings by service
            const serviceBookings = {};
            const serviceRevenue = {};

            bookings.forEach((booking) => {
                const serviceName = booking.service?.title || 'Unknown';
                serviceBookings[serviceName] = (serviceBookings[serviceName] || 0) + 1;
                if (booking.status === 'completed') {
                    serviceRevenue[serviceName] =
                        (serviceRevenue[serviceName] || 0) + (booking.total_price || 0);
                }
            });

            const bookingsByService = Object.entries(serviceBookings).map(([name, count]) => ({
                name,
                count,
            }));

            const revenueByService = Object.entries(serviceRevenue).map(([name, revenue]) => ({
                name,
                revenue,
            }));

            setAnalytics({
                totalEarnings,
                monthlyEarnings,
                totalBookings: bookings.length,
                completedBookings: bookings.filter((b) => b.status === 'completed').length,
                averageRating,
                revenueByMonth,
                bookingsByService,
                revenueByService,
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const csv = [
            ['Metric', 'Value'],
            ['Total Earnings', `₹${analytics.totalEarnings}`],
            ['Monthly Earnings', `₹${analytics.monthlyEarnings}`],
            ['Total Bookings', analytics.totalBookings],
            ['Completed Bookings', analytics.completedBookings],
            ['Average Rating', analytics.averageRating.toFixed(1)],
            [''],
            ['Revenue by Month'],
            ['Month', 'Revenue'],
            ...analytics.revenueByMonth.map((item) => [item.month, `₹${item.revenue}`]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Analytics exported!');
    };

    const COLORS = ['#D63864', '#F97316', '#FFD93D', '#27AE60', '#3498DB', '#9B59B6'];

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '4rem' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid rgba(214, 56, 100, 0.2)',
                        borderTopColor: '#D63864',
                        borderRadius: '50%',
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Analytics Dashboard
                    </h1>
                    <p style={{ color: '#666' }}>Track your performance and earnings</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--md-sys-color-outline)',
                            outline: 'none',
                        }}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                    </select>
                    <Button variant="outlined" size="sm" onClick={exportToCSV}>
                        <Download size={16} style={{ marginRight: '0.5rem' }} />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <DollarSign size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Earnings</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#27AE60' }}>
                                    ₹{analytics.totalEarnings.toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #D63864 0%, #F97316 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingUp size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Monthly Earnings</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D63864' }}>
                                    ₹{analytics.monthlyEarnings.toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Calendar size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Total Bookings</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3498DB' }}>
                                    {analytics.totalBookings}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card className="glass" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #F39C12 0%, #F1C40F 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Star size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Average Rating</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F39C12' }}>
                                    {analytics.averageRating.toFixed(1)} ⭐
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Revenue by Month */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Revenue Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analytics.revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                            <YAxis style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#D63864" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Bookings by Service */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Bookings by Service
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.bookingsByService}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" style={{ fontSize: '0.75rem' }} />
                            <YAxis style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#F97316" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Revenue by Service */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Revenue by Service
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={analytics.revenueByService}
                                dataKey="revenue"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {analytics.revenueByService.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default ProviderAnalytics;
