# 冒泡

```js
function bubbleSort(arr){
    for(let i = 0; i < arr.length - 1; i++){
    	for(let j = 0; j < arr.length - 1 - i; j++){
            let temp = arr[j];
            if(temp > arr[j+1]){
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}
```

# 选择

```js
function selectionSort(arr) {
  let index = 0,
    l = arr.length;
  for (let i = 0; i < l - 1; i++) {
    index = i;
    for (let j = i + 1; j < l; j++) {
      if (arr[index] < arr[j]) {
        index = j;
      }
    }
    if (i !== index) {
      let temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
    }
  }
}
```

# 插入

```js
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    let temp = arr[i];
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr;
}
```

# 归并

```js
function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  let mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}

function merge(left, right) {
  let leftIndex = (rightIndex = 0);
  let leftLength = left.length,
    rightLength = right.length;
  let res = [];
  while (leftIndex < leftLength && rightIndex < rightLength) {
    if (left[leftIndex] < right[rightIndex]) {
      res.push(left[leftIndex++]);
    } else {
      res.push(right[rightIndex++]);
    }
  }

  if (leftIndex === leftLength) {
    while(rightIndex < rightLength){
        res.push(right[rightIndex++]);
    }
  } else {
    while(leftIndex < leftLength){
        res.push(right[leftIndex++]);
    }
  }
  return res;
}
```

# 快排

```js
function quickSort(arr, left, right) {
  left = typeof left === "number" ? left : 0;
  right = typeof right === "number" ? right : arr.length - 1;

  if (left < right) {
    let qivot = partition(arr, left, right);
    quickSort(arr, 0, qivot - 1);
    quickSort(arr, qivot + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  let qivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] >= qivot) {
      right--;
    }
    arr[left] = arr[right];
    while (left < right && arr[left] <= qivot) {
      left++;
    }
    arr[right] = arr[left];
  }
  arr[left] = qivot;
  return left;
}
```