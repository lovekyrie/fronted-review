  function sortAndReturnTextContent() {
      const items = document.getElementById('myList').children;
      // 在此补全代码
      const sortedItems = Array.from(items).sort((a, b) => a.textContent.localeCompare(b.textContent))
      sortedItems.forEach(item => {
        document.getElementById('myList').appendChild(item)
      })
    }
    sortAndReturnTextContent()