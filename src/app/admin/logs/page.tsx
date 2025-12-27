// src/app/admin/logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    AlertCircle,
    Info,
    AlertTriangle,
    Bug,
    Server,
    Clock,
    Download,
    Eye,
    Trash2,
    RefreshCw,
    ChevronDown,
    X,
    Calendar,
    User,
    Globe,
    BarChart3,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { logApi } from '@/lib/apiClient';
import { ApplicationLog, ApplicationLogLevel, LogSource, LogStats } from '@/types';
import { format } from 'date-fns';

export default function LogsPage() {
    const [logs, setLogs] = useState<ApplicationLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<ApplicationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [logStats, setLogStats] = useState<LogStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState<ApplicationLogLevel | 'all'>('all');
    const [sourceFilter, setSourceFilter] = useState<LogSource | 'all'>('all');
    const [dateRange, setDateRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');

    // Modal states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ApplicationLog | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    // Feedback states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch logs and stats
    const fetchLogsAndStats = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch logs
            const logsResponse = await logApi.getAllLogs(currentPage, itemsPerPage, {
                search: searchQuery || undefined,
                level: levelFilter !== 'all' ? levelFilter : undefined,
                source: sourceFilter !== 'all' ? sourceFilter : undefined,
            });

            setLogs(logsResponse.logs);
            setFilteredLogs(logsResponse.logs);
            setTotalPages(logsResponse.pagination.totalPages);

            // Fetch stats
            const statsResponse = await logApi.getLogStats(dateRange);
            setLogStats(statsResponse.stats);

        } catch (err) {
            console.error('Error fetching logs:', err);
            setError('Failed to load logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogsAndStats();
    }, [currentPage, itemsPerPage, dateRange]);

    // Apply filters locally for immediate feedback
    useEffect(() => {
        let filtered = [...logs];

        // Apply level filter
        if (levelFilter !== 'all') {
            filtered = filtered.filter(log => log.level === levelFilter);
        }

        // Apply source filter
        if (sourceFilter !== 'all') {
            filtered = filtered.filter(log => log.source === sourceFilter);
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(log =>
                log.message.toLowerCase().includes(query) ||
                log.endpoint?.toLowerCase().includes(query) ||
                log.userId?.toLowerCase().includes(query) ||
                log.ip?.toLowerCase().includes(query)
            );
        }

        setFilteredLogs(filtered);
    }, [searchQuery, levelFilter, sourceFilter, logs]);

    // Handle cleanup
    const handleCleanup = async () => {
        try {
            setError('');
            setSuccess('');

            // In a real implementation, you would call logApi.cleanupLogs()
            // For now, simulate cleanup
            const recentLogs = logs.filter(log => {
                const logDate = new Date(log.timestamp);
                const daysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return logDate > daysAgo;
            });

            setLogs(recentLogs);
            setCleanupDialogOpen(false);
            setSuccess('Logs cleaned up successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error cleaning up logs:', err);
            setError('Failed to clean up logs');
        }
    };

    // Open view dialog
    const openViewDialog = (log: ApplicationLog) => {
        setSelectedLog(log);
        setViewDialogOpen(true);
    };

    // Get level badge
    const getLevelBadge = (level: ApplicationLogLevel) => {
        const levelConfig = {
            [ApplicationLogLevel.ERROR]: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: AlertCircle
            },
            [ApplicationLogLevel.WARN]: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: AlertTriangle
            },
            [ApplicationLogLevel.INFO]: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: Info
            },
            [ApplicationLogLevel.DEBUG]: {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: Bug
            },
            [ApplicationLogLevel.HTTP]: {
                color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                icon: Server
            },
        };

        const config = levelConfig[level];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} border flex items-center space-x-1`}>
                <Icon className="h-3 w-3" />
                <span className="uppercase">{level}</span>
            </Badge>
        );
    };

    // Get source badge
    const getSourceBadge = (source: LogSource) => {
        const sourceConfig = {
            [LogSource.API]: { color: 'bg-purple-100 text-purple-800', icon: Server },
            [LogSource.DATABASE]: { color: 'bg-indigo-100 text-indigo-800', icon: DatabaseIcon },
            [LogSource.AUTH]: { color: 'bg-pink-100 text-pink-800', icon: Shield },
            [LogSource.PAYMENT]: { color: 'bg-emerald-100 text-emerald-800', icon: DollarSignIcon },
            [LogSource.EMAIL]: { color: 'bg-cyan-100 text-cyan-800', icon: MailIcon },
            [LogSource.SYSTEM]: { color: 'bg-gray-100 text-gray-800', icon: Server },
            [LogSource.UNKNOWN]: { color: 'bg-gray-100 text-gray-800', icon: QuestionMarkIcon },
        };

        const config = sourceConfig[source];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} border`}>
                <Icon className="h-3 w-3 mr-1" />
                <span className="capitalize">{source}</span>
            </Badge>
        );
    };

    // Get status code badge
    const getStatusCodeBadge = (statusCode?: number) => {
        if (!statusCode) return null;

        let color = 'bg-gray-100 text-gray-800';
        if (statusCode >= 200 && statusCode < 300) color = 'bg-emerald-100 text-emerald-800';
        if (statusCode >= 300 && statusCode < 400) color = 'bg-blue-100 text-blue-800';
        if (statusCode >= 400 && statusCode < 500) color = 'bg-yellow-100 text-yellow-800';
        if (statusCode >= 500) color = 'bg-red-100 text-red-800';

        return (
            <Badge className={`${color} border`}>
                {statusCode}
            </Badge>
        );
    };

    // Format date
    const formatDate = (date: Date) => {
        return format(new Date(date), 'MMM dd, yyyy HH:mm:ss');
    };

    // Format duration
    const formatDuration = (ms?: number) => {
        if (!ms) return 'N/A';
        return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
                    <p className="text-gray-600 mt-2">
                        Monitor application health and debug issues
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        onClick={fetchLogsAndStats}
                        className="flex items-center"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>

                    {/* Cleanup Button */}
                    <AlertDialog open={cleanupDialogOpen} onOpenChange={setCleanupDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cleanup
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cleanup Old Logs</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete logs older than 30 days.
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCleanup}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Cleanup Logs
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Stats Overview */}
            {logStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Logs</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {logStats.totalLogs.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Last {logStats.timeframe}</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <BarChart3 className="h-6 w-6 text-emerald-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Errors</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {logStats.errors.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {logStats.errorRate > 0 ? `${(logStats.errorRate * 100).toFixed(1)}% rate` : 'No errors'}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Warnings</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {logStats.warnings.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Require attention</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-yellow-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {logStats.avgResponseTime.toFixed(0)}ms
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">API performance</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-blue-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success/Error Messages */}
            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-700 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {success}
                    </p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                    </p>
                </div>
            )}

            {/* Filters and Controls */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search logs by message, endpoint, IP..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            {/* Level Filter */}
                            <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as any)}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value={ApplicationLogLevel.ERROR}>Error</SelectItem>
                                    <SelectItem value={ApplicationLogLevel.WARN}>Warning</SelectItem>
                                    <SelectItem value={ApplicationLogLevel.INFO}>Info</SelectItem>
                                    <SelectItem value={ApplicationLogLevel.DEBUG}>Debug</SelectItem>
                                    <SelectItem value={ApplicationLogLevel.HTTP}>HTTP</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Source Filter */}
                            <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as any)}>
                                <SelectTrigger className="w-[140px]">
                                    <Server className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    <SelectItem value={LogSource.API}>API</SelectItem>
                                    <SelectItem value={LogSource.DATABASE}>Database</SelectItem>
                                    <SelectItem value={LogSource.AUTH}>Auth</SelectItem>
                                    <SelectItem value={LogSource.PAYMENT}>Payment</SelectItem>
                                    <SelectItem value={LogSource.EMAIL}>Email</SelectItem>
                                    <SelectItem value={LogSource.SYSTEM}>System</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Range Filter */}
                            <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                                <SelectTrigger className="w-[140px]">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Timeframe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hour">Last Hour</SelectItem>
                                    <SelectItem value="day">Last 24 Hours</SelectItem>
                                    <SelectItem value="week">Last Week</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Export Button */}
                            <Button variant="outline" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {filteredLogs.length} of {logs.length} logs
                    {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </p>
                {(searchQuery || levelFilter !== 'all' || sourceFilter !== 'all') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearchQuery('');
                            setLevelFilter('all');
                            setSourceFilter('all');
                        }}
                        className="text-gray-600 hover:text-emerald-700"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Logs Table */}
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No logs found
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto">
                                            {searchQuery || levelFilter !== 'all' || sourceFilter !== 'all'
                                                ? 'No logs match your filters. Try adjusting your search criteria.'
                                                : 'No logs have been recorded yet.'
                                            }
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        className={`hover:bg-gray-50 ${log.level === ApplicationLogLevel.ERROR ? 'bg-red-50/50' : ''}`}
                                    >
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDate(log.timestamp)}
                                                </p>
                                                {log.responseTime && (
                                                    <p className="text-xs text-gray-500">
                                                        {formatDuration(log.responseTime)}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getLevelBadge(log.level)}
                                        </TableCell>
                                        <TableCell>
                                            {getSourceBadge(log.source)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm truncate" title={log.message}>
                                                    {log.message}
                                                </p>
                                                {log.userId && (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        User: {log.userId}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {log.endpoint ? (
                                                <div className="max-w-xs">
                                                    <p className="text-sm truncate" title={`${log.method} ${log.endpoint}`}>
                                                        <span className="font-mono text-xs bg-gray-100 px-1 rounded mr-1">
                                                            {log.method}
                                                        </span>
                                                        {log.endpoint}
                                                    </p>
                                                    {log.ip && (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {log.ip}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusCodeBadge(log.statusCode)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openViewDialog(log)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {itemsPerPage} per page
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 w-8 ${currentPage === pageNum ? 'bg-emerald-600' : ''}`}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* View Log Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    {selectedLog && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Log Details</DialogTitle>
                                <DialogDescription>
                                    {selectedLog.level.toUpperCase()} • {formatDate(selectedLog.timestamp)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Log Header */}
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            {getLevelBadge(selectedLog.level)}
                                            {getSourceBadge(selectedLog.source)}
                                        </div>
                                        <p className="text-sm font-medium">
                                            {selectedLog.message}
                                        </p>
                                    </div>
                                    {selectedLog.responseTime && (
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Response Time</p>
                                            <p className="text-lg font-bold text-emerald-700">
                                                {formatDuration(selectedLog.responseTime)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Basic Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Log ID</p>
                                        <p className="font-mono text-sm">{selectedLog.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Timestamp</p>
                                        <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
                                    </div>
                                    {selectedLog.userId && (
                                        <div>
                                            <p className="text-sm text-gray-600">User ID</p>
                                            <p className="font-medium flex items-center">
                                                <User className="h-4 w-4 mr-1" />
                                                {selectedLog.userId}
                                            </p>
                                        </div>
                                    )}
                                    {selectedLog.requestId && (
                                        <div>
                                            <p className="text-sm text-gray-600">Request ID</p>
                                            <p className="font-mono text-sm">{selectedLog.requestId}</p>
                                        </div>
                                    )}
                                </div>

                                {/* HTTP Details */}
                                {(selectedLog.endpoint || selectedLog.method) && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold flex items-center">
                                            <Server className="h-4 w-4 mr-2" />
                                            HTTP Request
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedLog.method && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">Method</p>
                                                        <Badge className="bg-gray-100">
                                                            {selectedLog.method}
                                                        </Badge>
                                                    </div>
                                                )}
                                                {selectedLog.endpoint && (
                                                    <div className="col-span-2">
                                                        <p className="text-sm text-gray-600">Endpoint</p>
                                                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                                            {selectedLog.endpoint}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedLog.ip && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">IP Address</p>
                                                        <p className="font-medium flex items-center">
                                                            <Globe className="h-4 w-4 mr-1" />
                                                            {selectedLog.ip}
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedLog.statusCode && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">Status Code</p>
                                                        {getStatusCodeBadge(selectedLog.statusCode)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error Stack Trace */}
                                {selectedLog.errorStack && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Stack Trace
                                        </h3>
                                        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                                            <pre className="text-xs text-red-800 p-4 overflow-x-auto">
                                                {selectedLog.errorStack}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Metadata */}
                                {selectedLog.meta && Object.keys(selectedLog.meta).length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Metadata</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <pre className="text-xs text-gray-800 overflow-x-auto">
                                                {JSON.stringify(selectedLog.meta, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setViewDialogOpen(false)}
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Placeholder icons for sources
function DatabaseIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
    );
}

function DollarSignIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function MailIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function QuestionMarkIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}