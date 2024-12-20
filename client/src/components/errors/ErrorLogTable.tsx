import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';

interface RobotError {
  id: string;
  error_type: string;
  severity: string;
  description: string;
  created_at: string;
  resolved_at: string | null;
  robot_id: string;
}

interface ErrorLogTableProps {
  errors: RobotError[];
}

export function ErrorLogTable({ errors }: ErrorLogTableProps) {
  const [sortField, setSortField] = useState<keyof RobotError>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: keyof RobotError) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredErrors = errors.filter(error => {
    if (filterType !== 'all' && error.error_type !== filterType) return false;
    if (filterSeverity !== 'all' && error.severity !== filterSeverity) return false;
    if (searchQuery && !error.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedErrors = [...filteredErrors].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue! < bValue!) return -1 * modifier;
    if (aValue! > bValue!) return 1 * modifier;
    return 0;
  });

  const errorTypes = Array.from(new Set(errors.map(error => error.error_type)));
  const severityLevels = Array.from(new Set(errors.map(error => error.severity)));

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {errorTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityLevels.map(severity => (
              <SelectItem key={severity} value={severity}>{severity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('error_type')}
              >
                Type {sortField === 'error_type' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('severity')}
              >
                Severity {sortField === 'severity' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('description')}
              >
                Description {sortField === 'description' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('created_at')}
              >
                Created {sortField === 'created_at' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedErrors.map((error) => (
              <TableRow key={error.id}>
                <TableCell className="font-medium">{error.error_type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    error.severity === 'high' ? 'bg-red-100 text-red-800' :
                    error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {error.severity}
                  </span>
                </TableCell>
                <TableCell>{error.description}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(error.created_at), { addSuffix: true })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    error.resolved_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {error.resolved_at ? 'Resolved' : 'Open'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}