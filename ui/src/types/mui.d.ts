import '@material-ui/core/styles';

declare module "@mui/material/styles/createPalette" {
    interface Palette {
        seaBlue: Palette['primary'];
    }

    interface PaletteOptions {
        seaBlue: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        seaBlue: true;
    }
}

declare module "@mui/material/Step" {
    interface StepPropsColorOverrides {
        seaBlue: true;
    }
}

declare module "@mui/material/Pagination" {
    interface PaginationPropsColorOverrides {
        seaBlue: true;
    }
}

declare module "@mui/material/AppBar" {
    interface AppBarPropsColorOverrides {
        seaBlue: true;
    }
}