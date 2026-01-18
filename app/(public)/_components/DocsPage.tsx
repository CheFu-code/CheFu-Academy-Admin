import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code, Github, LifeBuoy, Rocket } from 'lucide-react';
import React from 'react';

const DocsPage = () => {
    return (
        <div className="container min-h-screen mx-auto bg-background p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">CheFu Academy SDK</h1>
                <p className="text-muted-foreground">
                    Seamlessly integrate CheFu Academy into your applications
                </p>
                <div className="mt-4 flex justify-center gap-2">
                    <Button className="cursor-pointer">Get Started</Button>
                    <Button variant={'outline'} className="cursor-pointer">
                        View API Docs
                    </Button>
                    <Button variant={'ghost'} className="cursor-pointer">
                        <Github className=" w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="getting-started" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="getting-started"
                        className="cursor-pointer"
                    >
                        <Rocket className="h-4 w-4 mr-2" />
                        Getting Started
                    </TabsTrigger>
                    <TabsTrigger
                        value="api-reference"
                        className="cursor-pointer"
                    >
                        <Code className="h-4 w-4 mr-2" />
                        API Reference
                    </TabsTrigger>
                    <TabsTrigger value="examples" className="cursor-pointer">
                        <Book className="h-4 w-4 mr-2" />
                        Examples
                    </TabsTrigger>
                    <TabsTrigger value="support" className="cursor-pointer">
                        <LifeBuoy className="h-4 w-4 mr-2" />
                        Support
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="getting-started">
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                            <CardDescription>
                                Integrate CheFu Academy into your application in
                                3 steps
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <h3 className="font-semibold">
                                    1. Register for an API Key
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create an account on the CheFu Academy
                                    developer dashboard to obtain an API Key.
                                </p>
                                <Button variant={'outline'} size={'sm'}>
                                    Register Now
                                </Button>
                            </div>
                            <div className="space-y-2 mt-8">
                                <h3 className="font-semibold">
                                    2. Install the SDK
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Include the CheFu Academy SDK in your
                                    project using npm:
                                </p>
                                <pre className="p-2 bg-muted rounded-md text-sm">
                                    <code>npm install chefu-academy-sdk</code>
                                </pre>
                            </div>
                            <div className="space-y-2 mt-8">
                                <h3 className="font-semibold">
                                    3. Initialize the SDK
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Initialize the SDK with your API Key:
                                </p>
                                <pre className="p-2 bg-muted rounded-md text-sm">
                                    <code>
                                        import CheFuAcademy from
                                        &apos;chefu-academy-sdk&apos;;
                                        <br />
                                        <br />
                                        const chefuAcademy = new
                                        CheFuAcademy(&apos;YOUR_API_KEY&apos;);
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                            <CardDescription>
                                Explore the features of the CheFu Academy SDK
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>
                                        Seamless integration with your
                                        application
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>
                                        Access to our comprehensive API
                                        reference
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>
                                        Support for multiple programming
                                        languages
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>Dedicated support team</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api-reference">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Reference</CardTitle>
                            <CardDescription>
                                Explore our API endpoints and parameters
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Courses</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>
                                            <a
                                                href="#get-course"
                                                className="hover:underline"
                                            >
                                                GET /courses/{'{'}courseId{'}'}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Progress</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>
                                            <a
                                                href="#get-course-progress"
                                                className="hover:underline"
                                            >
                                                GET /progress/{'{'}courseId{'}'}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>API Status</CardTitle>
                            <CardDescription>
                                Check the current status of our API
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>All systems operational</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="examples">
                    <Card>
                        <CardHeader>
                            <CardTitle>Examples</CardTitle>
                            <CardDescription>
                                See the SDK in action with these examples
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="font-semibold">
                                    Fetch User Courses
                                </h3>
                                <pre className="p-2 bg-muted rounded-md text-sm">
                                    <code>
                                        chefuAcademy.getCourses()
                                        <br />
                                        .then(courses =&gt;
                                        console.log(courses))
                                        <br />
                                        .catch(error =&gt;
                                        console.error(error));
                                    </code>
                                </pre>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold">
                                    Track User Progress
                                </h3>
                                <pre className="p-2 bg-muted rounded-md text-sm">
                                    <code>
                                        chefuAcademy.getProgress(&apos;course-123&apos;)
                                        <br />
                                        .then(progress =&gt;
                                        console.log(progress))
                                        <br />
                                        .catch(error =&gt;
                                        console.error(error));
                                    </code>
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="support">
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                            <CardDescription>
                                Get help with integrating CheFu Academy
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Contact our support team at{' '}
                                <a
                                    className="hover:underline text-blue-500"
                                    href="mailto:chefu.inc@gmail.com"
                                >
                                    chefu.inc@gmail.com
                                </a>{' '}
                                for assistance
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DocsPage;
