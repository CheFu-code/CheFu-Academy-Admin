'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import countryList from 'react-select-country-list';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const schema = z.object({
    countryCode: z.string().min(1, 'Please select your country'),
});

type AddCountryCodePageProps = {
    params: {
        id: string;
    };
};

export default function AddCountryCode({ params }: AddCountryCodePageProps) {
    const router = useRouter();
    const countries = React.useMemo(() => countryList().getData(), []);
    const { user, loading } = useAuthUser();
    const routeUserId = params?.id?.trim();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { countryCode: '' },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (!user?.email) {
            toast.error('You must be signed in to save your country.');
            return;
        }
        if (!routeUserId) {
            toast.error('Invalid link. Missing user id.');
            return;
        }
        if (user.uid !== routeUserId) {
            toast.error('This link does not match your account.');
            return;
        }
        const selected = countries.find((c) => c.value === values.countryCode);
        const country = selected?.label ?? values.countryCode;

        try {
            await setDoc(
                doc(db, 'users', user?.email),
                {
                    uid: routeUserId,
                    countryCode: values.countryCode, // e.g., 'ZA'
                    country, // e.g., 'South Africa'
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );

            toast.success('Country saved', {
                description: `You selected: ${country}`,
            });

            router.push('/courses');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save country. Please try again.');
        }
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Add your country</CardTitle>
                    <CardDescription>
                        Select your country to personalize your experience.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Country Field */}
                            <FormField
                                control={form.control}
                                name="countryCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Country</Label>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="mt-2 cursor-pointer hover:bg-primary/70">
                                                    <SelectValue placeholder="Select your country" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-72">
                                                    {countries.map((c) => (
                                                        <SelectItem
                                                            key={c.value}
                                                            value={c.value}
                                                        >
                                                            {c.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={isSubmitting || loading}
                            >
                                {isSubmitting ? 'Saving...' : 'Save & Continue'}
                            </Button>

                            {!user?.email && !loading && (
                                <p className="text-sm text-muted-foreground">
                                    Please sign in to continue.
                                </p>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
