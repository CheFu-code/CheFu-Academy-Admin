import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const formatDate = (value: ApiKey['lastUsedAt']) => {
    if (!value) return 'Never';
    if (typeof value === 'string') return new Date(value).toLocaleString();
    return new Date(value._seconds * 1000).toLocaleString();
};

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
    const skeletonRows = Array.from({ length: 3 });

    return (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-semibold text-white">API Keys</h3>
                    <p className="text-sm text-zinc-500">
                        Active keys can query courses and videos through the SDK.
                    </p>
                </div>
                <Button
                    size="sm"
                    className="w-fit cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    Create API Key
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="font-semibold text-zinc-400">Name</TableHead>
                        <TableHead className="font-semibold text-zinc-400">Status</TableHead>
                        <TableHead className="font-semibold text-zinc-400">Plan</TableHead>
                        <TableHead className="font-semibold text-zinc-400">Last Used</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-400">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading
                        ? skeletonRows.map((_, idx) => (
                              <TableRow key={idx} className="border-white/10">
                                  <TableCell>
                                      <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                                  </TableCell>
                                  <TableCell>
                                      <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
                                  </TableCell>
                                  <TableCell>
                                      <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                                  </TableCell>
                                  <TableCell>
                                      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <div className="ml-auto h-8 w-16 animate-pulse rounded bg-white/10" />
                                  </TableCell>
                              </TableRow>
                          ))
                        : keys.map((key) => (
                              <TableRow
                                  key={key.id}
                                  className="border-white/10 text-zinc-300 hover:bg-white/[0.03]"
                              >
                                  <TableCell className="font-medium text-white">
                                      {key.name}
                                  </TableCell>
                                  <TableCell>
                                      {key.active ? (
                                          <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20">
                                              Active
                                          </Badge>
                                      ) : (
                                          <Badge variant="destructive">Revoked</Badge>
                                      )}
                                  </TableCell>
                                  <TableCell>{key.plan}</TableCell>
                                  <TableCell>{formatDate(key.lastUsedAt)}</TableCell>
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

            {!loading && keys.length === 0 && (
                <div className="border-t border-white/10 px-4 py-8 text-center text-sm text-zinc-500">
                    No API key yet. Create one from this page or with the CLI.
                </div>
            )}
        </div>
    );
};

export default TableComp;
