import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { ApiKey } from '@/types/keys';
import { Loader } from 'lucide-react';
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
                        {keys.map((key) => (
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
                                <TableCell>{key.lastUsedAt || '—'}</TableCell>
                                <TableCell className="text-right">
                                    {key.active && (
                                        <Button
                                            className="cursor-pointer"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => revokeKey(key.id)}
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {!keys && !loading && (
                    <div className="text-center text-base mt-2 text-muted-foreground">
                        No API key yet
                    </div>
                )}

                {loading && (
                    <div className="flex flex-row items-center mt-3 gap-2">
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Loading...
                        </p>
                        <Loader className={'size-3 animate-spin'} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TableComp;
