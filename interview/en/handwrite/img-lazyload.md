# Image lazy loading

```javascript
// Lazy load with getBoundingClientRect

let imgList1 = [...document.querySelectorAll('.get_bounding_rect')]
const length = imgList1.length

let lazyLoad1 = (function () {
  let count = 0
  return function () {
    const deleteIndexList = []
    imgList1.forEach((img, index) => {
      const rect = img.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src
        // After load starts, mark the image for removal
        deleteIndexList.push(index)
        count++
        if (count === length) {
          // Unbind scroll when every image has loaded
          document.removeEventListener('scroll', lazyLoad1)
        }
      }
    })
    // Drop images that already started loading
    imgList1 = imgList1.filter((_, index) => !deleteIndexList.includes(index))
  }
})()

// Uses the throttle helper from throttle.js
lazyLoad1 = throttle(lazyLoad1, 100)
document.addEventListener('scroll', lazyLoad1)
// Run once by hand, otherwise above-the-fold images never see a scroll event
lazyLoad1()

// Lazy load with IntersectionObserver
const imgList2 = Array.from(document.querySelectorAll('.intersection_observer'))

const lazyLoad2 = (function () {
  // Create the observer
  const observe = new IntersectionObserver((entries) => {
    // `entries` holds IntersectionObserverEntry for every observed element
    entries.forEach((entry) => {
      // > 0 means it entered the viewport
      if (entry.intersectionRatio > 0) {
        entry.target.src = entry.target.dataset.src
        // Stop observing this image
        observe.unobserve(entry.target)
      }
    })
  })
  imgList2.forEach((img) => {
    observe.observe(img)
  })
})()

lazyLoad2()
```
