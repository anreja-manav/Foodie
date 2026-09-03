export const darkFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#1a1a1a',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#ef4444' },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    // Kill Chrome/Edge's autofill white background
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #1a1a1a inset',
      WebkitTextFillColor: '#fff',
      caretColor: '#fff',
      borderRadius: 'inherit',
    },
    '&:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 1000px #1a1a1a inset',
    },
    '&:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 1000px #1a1a1a inset',
    },
  },
  '& .MuiInputLabel-root': { color: '#9ca3af' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' },
};