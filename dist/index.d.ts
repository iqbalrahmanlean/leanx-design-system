declare const colors: {
    readonly background: "hsl(0 0% 100%)";
    readonly foreground: "hsl(222.2 84% 4.9%)";
    readonly primary: "hsl(222.2 47.4% 11.2%)";
    readonly 'primary-foreground': "hsl(210 40% 98%)";
    readonly secondary: "hsl(210 40% 96%)";
    readonly 'secondary-foreground': "hsl(222.2 84% 4.9%)";
    readonly destructive: "hsl(0 84.2% 60.2%)";
    readonly 'destructive-foreground': "hsl(210 40% 98%)";
};
declare const spacing: {
    readonly xs: "0.25rem";
    readonly sm: "0.5rem";
    readonly md: "1rem";
    readonly lg: "1.5rem";
    readonly xl: "2rem";
};

declare const buttonStyles = "./button/button.css";
declare const inputStyles = "./input/input.css";
declare const cardStyles = "./card/card.css";
declare const badgeStyles = "./badge/badge.css";

export { badgeStyles, buttonStyles, cardStyles, colors, inputStyles, spacing };
