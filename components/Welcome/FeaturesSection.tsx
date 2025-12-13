import { features } from '@/constants/Data';
import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

const FeaturesSection = () => {
    return (
        <section className="grid cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {features.map((feature, index) => {
                const Icon = feature.icon; // grab the component
                return (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="text-4xl mb-2 text-white">
                                <Icon />
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold">
                                {feature.title}
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
};

export default FeaturesSection;
