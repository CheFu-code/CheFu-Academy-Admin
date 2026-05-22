import { Input } from '../ui/input';
import { buttonVariants } from '@/components/ui/button';

const CallToActionSection = () => {
    return (
        <section className="py-20 bg-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
                Start Your Learning Journey Today
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of smart learners who are improving their skills
                and achieving their goals. Sign up now and get instant access to
                all courses and resources.
            </p>

            {/* Newsletter subscription */}
            <div className="mt-8 max-w-md mx-auto">
                <p className="mb-4 text-lg  font-medium">
                    Subscribe to our newsletter for updates
                </p>
                <form
                    action="mailto:chefu.inc@gmail.com"
                    method="post"
                    className="flex gap-2"
                >
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                    <button
                        className={buttonVariants({
                            variant: 'secondary',
                        })}
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CallToActionSection;
