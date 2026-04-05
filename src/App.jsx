import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
const BINGO_RANGES = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
};

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Initialize state from localStorage if available
  const [calledNumbers, setCalledNumbers] = useState(() => {
    const saved = localStorage.getItem('bingo_calledNumbers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentNumber, setCurrentNumber] = useState(() => {
    const saved = localStorage.getItem('bingo_currentNumber');
    return saved ? JSON.parse(saved) : null;
  });

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('bingo_calledNumbers', JSON.stringify(calledNumbers));
  }, [calledNumbers]);

  useEffect(() => {
    localStorage.setItem('bingo_currentNumber', JSON.stringify(currentNumber));
  }, [currentNumber]);

  const callNextNumber = () => {
    const allPossibleNumbers = [];
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.includes(i)) {
        allPossibleNumbers.push(i);
      }
    }

    if (allPossibleNumbers.length === 0) {
      alert('All numbers have been called!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * allPossibleNumbers.length);
    const nextNumber = allPossibleNumbers[randomIndex];
    
    setCalledNumbers(prev => [...prev, nextNumber]);
    setCurrentNumber(nextNumber);
  };

  const getLetterForNumber = (num) => {
    if (num <= 15) return 'B';
    if (num <= 30) return 'I';
    if (num <= 45) return 'N';
    if (num <= 60) return 'G';
    return 'O';
  };

  const handleReset = () => {
    setCalledNumbers([]);
    setCurrentNumber(null);
    setResetDialogOpen(false);
    localStorage.removeItem('bingo_calledNumbers');
    localStorage.removeItem('bingo_currentNumber');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
          BINGO CALLER
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Paper elevation={3} sx={{ p: 4, minWidth: 200, textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              CURRENT NUMBER
            </Typography>
            <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
              {currentNumber ? `${getLetterForNumber(currentNumber)}-${currentNumber}` : '--'}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={callNextNumber}
              disabled={calledNumbers.length === 75}
              sx={{ px: 4, py: 1.5, fontSize: '1.2rem' }}
            >
              Call Next Number
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={() => setResetDialogOpen(true)}
              sx={{ px: 4, py: 1.5, fontSize: '1.2rem' }}
            >
              Reset
            </Button>
            {isInstallable && (
              <Button
                variant="contained"
                color="success"
                startIcon={<InstallMobileIcon />}
                onClick={handleInstallClick}
                sx={{ px: 4, py: 1.5, fontSize: '1.2rem', bgcolor: '#2e7d32' }}
              >
                Install App
              </Button>
            )}
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                {BINGO_LETTERS.map((letter) => (
                  <TableCell 
                    key={letter} 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.5rem', 
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'primary.main'
                    }}
                  >
                    {letter}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 15 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {BINGO_LETTERS.map((letter) => {
                    const [min] = BINGO_RANGES[letter];
                    const number = min + rowIndex;
                    const isCalled = calledNumbers.includes(number);
                    return (
                      <TableCell
                        key={`${letter}-${rowIndex}`}
                        align="center"
                        sx={{
                          fontSize: '1.2rem',
                          position: 'relative',
                          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                          color: isCalled ? 'text.disabled' : 'text.primary',
                          textDecoration: isCalled ? 'line-through' : 'none',
                          bgcolor: isCalled ? 'rgba(255, 255, 255, 0.03)' : 'inherit',
                          transition: 'all 0.3s ease',
                          fontWeight: isCalled ? 'normal' : '500'
                        }}
                      >
                        {number}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="body2" color="textSecondary">
            Numbers Called: {calledNumbers.length} / 75
          </Typography>
        </Box>

        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
        >
          <DialogTitle>Reset Game?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to reset the game? This will clear all called numbers and you cannot undo this action.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReset} color="secondary" autoFocus>
              Reset Game
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;
