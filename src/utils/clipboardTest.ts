// Test utility to verify clipboard functionality
export const testClipboardFunctionality = async (): Promise<{
  clipboardApiAvailable: boolean;
  canWriteToClipboard: boolean;
  fallbackWorking: boolean;
}> => {
  const results = {
    clipboardApiAvailable: false,
    canWriteToClipboard: false,
    fallbackWorking: false
  };

  // Check if Clipboard API is available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    results.clipboardApiAvailable = true;
    
    // Test if we can actually write to clipboard
    try {
      const testText = 'test-clipboard-' + Date.now();
      await navigator.clipboard.writeText(testText);
      
      // Verify it was written (if possible)
      if (navigator.clipboard.readText) {
        const readBack = await navigator.clipboard.readText();
        results.canWriteToClipboard = readBack === testText;
      } else {
        // If we can't read back, assume success if no error was thrown
        results.canWriteToClipboard = true;
      }
    } catch (error) {
      console.warn('Clipboard write test failed:', error);
      results.canWriteToClipboard = false;
    }
  }

  // Test fallback method (document.execCommand)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = 'test-fallback-' + Date.now();
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    results.fallbackWorking = document.execCommand('copy');
    document.body.removeChild(textArea);
  } catch (error) {
    console.warn('Fallback clipboard test failed:', error);
    results.fallbackWorking = false;
  }

  return results;
};

// Log clipboard capabilities to console
export const logClipboardCapabilities = async (): Promise<void> => {
  console.group('🔍 Clipboard Capabilities Test');
  
  const results = await testClipboardFunctionality();
  
  console.log('📋 Clipboard API Available:', results.clipboardApiAvailable);
  console.log('✍️ Can Write to Clipboard:', results.canWriteToClipboard);
  console.log('🔄 Fallback Method Working:', results.fallbackWorking);
  
  if (!results.canWriteToClipboard && !results.fallbackWorking) {
    console.warn('⚠️ No working clipboard methods available. Manual copy modal will be used.');
  } else if (!results.canWriteToClipboard && results.fallbackWorking) {
    console.info('ℹ️ Clipboard API blocked, but fallback method available.');
  } else {
    console.log('✅ Clipboard functionality working normally.');
  }
  
  console.groupEnd();
};
