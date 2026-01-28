import React from 'react';

const Header = ({
    header,
    description,
}: {
    header: string;
    description: string;
}) => {
    return (
        <div>
            <span className="text-3xl font-bold block">{header}</span>
            <p className="text-xs  sm:text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
};

export default Header;
