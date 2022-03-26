# python

函数

```python
def power(x, n=2):
	s = 1
    whild n > 0:
        n--
        s=s*x
    return s
```

## 参数默认值

```python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L

def add(a, b, c=1, d=2):
    sum = a + b
    sum += c
    sum += d
    return sum
add(3, 4, 5, 6)
add(3,4,c=5)
add(3,4,d=5)
    
```

## 可变参数

```python
# 传入任意个数的参数
def calc(*numbers): 
    sum = 0
    for a in numbers:
        sum += a * a
    return sum

calc(1, 2, 3)
calc(*[1, 2, 3])
```





























































