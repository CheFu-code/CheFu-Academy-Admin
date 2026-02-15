import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { EmailPreview, PreviewSheet } from "./sub-components";
import type { PreviewDevice } from "./types";

type PreviewTabProps = {
    previewDevice: PreviewDevice;
    setPreviewDevice: (device: PreviewDevice) => void;
    subject: string;
    preheader: string;
    content: string;
};

export function PreviewTab({
    previewDevice,
    setPreviewDevice,
    subject,
    preheader,
    content,
}: PreviewTabProps) {
    return (
        <TabsContent value="preview" className="mt-6">
            <Card className="border-slate-800/60 bg-slate-900/40">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Live Preview</CardTitle>
                        <CardDescription>Subject & body render</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                            onClick={() => setPreviewDevice("desktop")}
                        >
                            <Monitor className="mr-2 h-4 w-4" />
                            Desktop
                        </Button>
                        <Button
                            variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                            onClick={() => setPreviewDevice("mobile")}
                        >
                            <Smartphone className="mr-2 h-4 w-4" />
                            Mobile
                        </Button>
                        <PreviewSheet subject={subject} preheader={preheader} content={content} />
                    </div>
                </CardHeader>
                <CardContent>
                    <EmailPreview
                        device={previewDevice}
                        subject={subject}
                        preheader={preheader}
                        content={content}
                    />
                </CardContent>
            </Card>
        </TabsContent>
    );
}
