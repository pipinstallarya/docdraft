/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add basic typography for markdown content
    function({ addComponents }) {
      addComponents({
        '.prose': {
          // Headings
          'h1': {
            fontSize: '1.875rem',
            fontWeight: '700',
            marginTop: '1.5rem',
            marginBottom: '1rem',
            lineHeight: '1.25',
          },
          'h2': {
            fontSize: '1.5rem',
            fontWeight: '600',
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
            lineHeight: '1.3',
          },
          'h3': {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
            lineHeight: '1.35',
          },
          'h4': {
            fontSize: '1.125rem',
            fontWeight: '600',
            marginTop: '1.25rem',
            marginBottom: '0.75rem',
          },
          // Paragraphs
          'p': {
            marginTop: '0.75rem',
            marginBottom: '0.75rem',
            lineHeight: '1.625',
          },
          // Lists
          'ul': {
            marginTop: '0.75rem',
            marginBottom: '0.75rem',
            paddingLeft: '1.625rem',
            listStyleType: 'disc',
          },
          'ol': {
            marginTop: '0.75rem',
            marginBottom: '0.75rem',
            paddingLeft: '1.625rem',
            listStyleType: 'decimal',
          },
          'li': {
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
          },
          // Blockquotes
          'blockquote': {
            fontStyle: 'italic',
            borderLeftWidth: '4px',
            borderLeftColor: '#e2e8f0',
            paddingLeft: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem',
          },
          // Code
          'code': {
            fontSize: '0.875rem',
            backgroundColor: '#f1f5f9',
            padding: '0.125rem 0.25rem',
            borderRadius: '0.25rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          'pre': {
            backgroundColor: '#f1f5f9',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflowX: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
          },
          'pre code': {
            backgroundColor: 'transparent',
            padding: '0',
            borderRadius: '0',
          },
          // Links
          'a': {
            color: '#3b82f6',
            textDecoration: 'underline',
            '&:hover': {
              color: '#2563eb',
            },
          },
          // Horizontal rule
          'hr': {
            marginTop: '2rem',
            marginBottom: '2rem',
            borderTopWidth: '1px',
            borderColor: '#e2e8f0',
          },
          // Tables
          'table': {
            width: '100%',
            tableLayout: 'auto',
            textAlign: 'left',
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            borderCollapse: 'collapse',
          },
          'thead': {
            borderBottomWidth: '2px',
            borderBottomColor: '#e2e8f0',
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: '#e2e8f0',
          },
          'th': {
            fontWeight: '600',
            padding: '0.75rem',
            verticalAlign: 'bottom',
          },
          'td': {
            padding: '0.75rem',
            verticalAlign: 'top',
          },
        }
      });
    }
  ],
};
