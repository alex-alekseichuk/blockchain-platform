/**
 * Write/Read to/from local file in browser.
 */
'use strict';
module.exports = {
  __name: 'fs',
  writeFile: (filename, data) => {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(data, filename);
      return;
    }
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.style = 'display:none';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);
  },
  readFile: (file, offset, size) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = err => reject(err);
      if (offset || size)
        reader.readAsArrayBuffer(file.slice(offset, offset + size));
      else
        reader.readAsArrayBuffer(file);
    });
  }
};
