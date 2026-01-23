import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ApiKey } from '@/types/keys';
import { Dispatch, SetStateAction } from 'react';

const TableComp = ({
    setOpen,
    loading,
    keys,
    revokeKey,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    keys: ApiKey[];
    revokeKey(id: string): Promise<void>;
}) => {
    const skeletonRows = Array.from({ length: 3 }); // Number of skeleton rows

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>API Keys</CardTitle>
                <Button
                    size={'sm'}
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    Create API Key
                </Button>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Plan</TableHead>
                            <TableHead className="font-bold">
                                Last Used
                            </TableHead>
                            <TableHead className="font-bold text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? skeletonRows.map((_, idx) => (
                                  <TableRow key={idx} className="animate-pulse">
                                      <TableCell>
                                          <div className="h-4 bg-gray-700 rounded w-24"></div>
                                      </TableCell>
                                      <TableCell>
                                          <div className="h-4 bg-gray-700 rounded w-16"></div>
                                      </TableCell>
                                      <TableCell>
                                          <div className="h-4 bg-gray-700 rounded w-20"></div>
                                      </TableCell>
                                      <TableCell>
                                          <div className="h-4 bg-gray-700 rounded w-32"></div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                          <div className="h-6 bg-gray-700 rounded w-16 mx-auto"></div>
                                      </TableCell>
                                  </TableRow>
                              ))
                            : keys.map((key) => (
                                  <TableRow key={key.id}>
                                      <TableCell>{key.name}</TableCell>
                                      <TableCell>
                                          {key.active ? (
                                              <Badge className="bg-green-500">
                                                  Active
                                              </Badge>
                                          ) : (
                                              <Badge
                                                  className="cursor-not-allowed hover:opacity-70"
                                                  variant="destructive"
                                              >
                                                  Revoked
                                              </Badge>
                                          )}
                                      </TableCell>
                                      <TableCell>{key.plan}</TableCell>
                                      <TableCell>
                                          {key.lastUsedAt
                                              ? typeof key.lastUsedAt ===
                                                'string'
                                                  ? new Date(
                                                        key.lastUsedAt,
                                                    ).toLocaleString()
                                                  : new Date(
                                                        key.lastUsedAt
                                                            ._seconds * 1000,
                                                    ).toLocaleString()
                                              : '—'}
                                      </TableCell>
                                      <TableCell className="text-right">
                                          {key.active && (
                                              <Button
                                                  className="cursor-pointer"
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() =>
                                                      revokeKey(key.id)
                                                  }
                                              >
                                                  Revoke
                                              </Button>
                                          )}
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>

                {!loading && keys.length === 0 && (
                    <div className="text-center text-base mt-2 text-muted-foreground">
                        No API key yet
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TableComp;
