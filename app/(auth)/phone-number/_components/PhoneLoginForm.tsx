import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';

const PhoneLoginForm = ({
    phoneNumber,
    setPhoneNumber,
    handleSubmit,
    loading,
}: {
    phoneNumber: string;
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent<Element>) => void;
    loading: boolean;
}) => {
    return (
        <Card id="recaptcha-container">
            <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>
                    Login to access your courses and continue learning.
                </CardDescription>
            </CardHeader>

            <form>
                <CardContent className="flex flex-col gap-4">
                    {/* Phone Number Input */}
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+27123456789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full mt-5"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            'Login with Phone Number'
                        )}
                    </Button>
                </CardContent>
            </form>
        </Card>
    );
};

export default PhoneLoginForm;
