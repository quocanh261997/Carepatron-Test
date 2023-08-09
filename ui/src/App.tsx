import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import DataProvider from './store/DataProvider';
import Clients from './pages/Clients';
import { ThemeProvider, createTheme } from '@mui/material';
import ResponsiveAppBar from './components/Navigation';

const theme = createTheme({
	components: {
		// Name of the component
		MuiButton: {
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					fontSize: '1rem',
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'--TextField-brandBorderColor': '#E0E3E7',
					'--TextField-brandBorderHoverColor': '#B2BAC2',
					'--TextField-brandBorderFocusedColor': '#6F7E8C',
					'& label.Mui-focused': {
						color: 'var(--TextField-brandBorderFocusedColor)',
					},
				},
			},
		},
	},
});

export default function App() {
	return (
		<div className='App'>
			<DataProvider>
				<ThemeProvider theme={theme}>
          <ResponsiveAppBar />
					<Routes>
						<Route path='/' element={<Clients />} />
						<Route path='/Clients' element={<Clients />} />
					</Routes>
				</ThemeProvider>
			</DataProvider>
		</div>
	);
}
