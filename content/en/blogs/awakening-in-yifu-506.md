---
title: "Enlightenment in Room 506, Yifu Building: Eigenvalues, Eigenvectors, and Jordan Canonical Form"
permalink: "en/awakening-in-yifu-506"
description: "Starting from matrices as linear transformations, this post derives the definition and computation of eigenvalues and eigenvectors, discusses how the number of free variables affects the count of eigenvectors when roots repeat, and introduces diagonalization and the Jordan canonical form."
created: 2026-11-18
modified: 2026-11-28
tags:
  - "linear-algebra"
  - "linear-transformation"
  - "eigenvalues"
  - "eigenvectors"
  - "jordan-canonical-form"
---
## Foreword

This article is actually unfinished. However, it is, in my opinion, my first article that fits the meaning of a "blog." Therefore, even though it is unfinished, I have no intention of finishing it (because the exams are over), I still put it on the blog website as the first blog post on the new blog site.

## Main Text

>This one is truly a blog post in my ideal form, gathering all my thoughts together, systematic, logical, and smooth. It is the product condensed from a period of continuous learning and thinking about a certain topic.
>Perhaps I will always remember this day. On this day there was also the autumn wind, like the majesty emanating from a supreme sovereign—clearly he was just sitting there upright, doing nothing, yet I could only bow my head and crawl forward.

^b0eabd

Let's start with matrices again. A matrix can be understood as a **linear transformation**, and there are two ways to view it. The first view is: a matrix represents a transformation of basis vectors; the second view is: a matrix represents new basis vectors, but note that at this time the coordinates of the vectors are not transformed. Both views are the same. [[en/notes/jordan-form-linear-map#^ee53da|I prefer the second view]], because the first view presupposes that the basis vectors are (1, 0) and (0, 1), that is, it presupposes a coordinate system.

During a linear transformation, some vectors **do not change direction** after the transformation; such vectors are **eigenvectors**. Although the direction does not change, they may be stretched or shrunk, and we call this scaling ratio the "**eigenvalue**." Because [[en/notes/matrix-diagonalization-notes#^92d134|eigenvectors can be used to simplify a matrix]], we want to compute them.

From the definition of eigenvectors, we can obtain a formula $Ax=\lambda x$, whose geometric meaning is that after the vector x undergoes the linear transformation represented by matrix A, its direction does not change, only its scale changes by $\lambda \text{ 倍}$. Then through simple algebraic manipulation, we can obtain the following expression (sometimes it is easy to understand at the algebraic level, so don't try to think about the geometric meaning, because you won't be able to figure it out):
$(A - \lambda I)x = 0$. Therefore, through simple algebraic operations, we know that **the eigenvectors are exactly the basis vectors of the null space of the new matrix $(A - \lambda I)$**.

What is the "null space"? During a linear transformation, some dimensions disappear. For example, in three-dimensional space, if a matrix compresses new vectors onto a plane, then one dimension has disappeared, and the null space is this line; still in three-dimensional space, if a matrix compresses new vectors onto a line, then two dimensions have disappeared, and the null space is a plane. The null space is also a space; in other words: the null space also has basis vectors. The eigenvectors of a matrix are the null space basis vectors of the new matrix after algebraic transformation... uh, actually it's fine if they aren't basis vectors... actually you can also call them basis vectors, because as long as two vectors are linearly independent, they can be treated as basis vectors.

ok, back to the expression $(A - \lambda I)x = 0$. Next we need to solve this equation. Since we do not consider the case where the vector x is the zero vector, for this expression to hold, it must be that $(A - \lambda I)=0$, that is, the determinant of the matrix $(A - \lambda I)$ is 0.

[[en/notes/linear-algebra#^b59599|How is the determinant computed]]? Two-dimensional, three-dimensional, triangle method simplification, properties (row and column swapping, factoring out common factors, adding rows and columns)

Thus we solve for the eigenvalues $\lambda$. Here there is a conclusion: different λ correspond to different linearly independent eigenvectors. Therefore, if the computed $\lambda \text{ 都不一样}$, this is a very good situation, and then one by one substitute $\lambda \text{ 代入}$, compute the system of equations $Bx=0$, and obtain the null space basis vectors of this matrix (would it be better to call it a fundamental solution system? Or a linear combination of basis vectors?), and then after substituting each $\lambda \text{ 都会得到一个特征向量}$, we can finally obtain all the eigenvectors of the "initial matrix."

But if the computed $\lambda \text{ 有一两个是相等的}$, that is, the so-called "repeated roots," then we need to discuss it. Substitute the repeated root $\lambda \text{ into}$$(A - \lambda I)$，得到 $Bx=0$ ，接着按照正常的高斯消元去解。重点关注消元结束之后，矩阵的秩的情况。换句话说，就是看消元结束后，**自由变量的个数**，因为自由变量对应着零空间的基向量（我说不出来为什么会这样，但是我觉得就是这样）。

假设「初始矩阵」是 3 阶的，然后 $\lambda_1, \lambda_2=\lambda_3$ ，我们把  $\lambda_2$ 代入「初始矩阵」，然后消元新矩阵。如果自由变量个数是一个，也就是这个新矩阵的零空间基向量只有一个，由上面的「**特征向量就是新矩阵$(A - \lambda I)$的零空间的基向量**」。我们就可以得到：「初始矩阵」的特征向量就是 $1+1$ 也就是 2 个；但是，如果自由变量的个数是两个，也就是新矩阵的零空间基向量有两个，我们就可以得到：「初始矩阵」的特征向量就是 $1+2=3$ 个。

为什么会出现两种不同的情况呢？我的理解是：$\lambda \text{ 只是反映了特征向量的伸缩比例}$，**并没有指示特征向量的方向**。我可以有两个共线的向量，$\lambda$ ，但是从维度来看，它们只是一维，并不是二维，也就是 $\lambda \text{ 没有提供两个方向}$。

ok，现在我们算出了「初始矩阵」的所有特征向量了，如果特征向量的个数不等于「初始矩阵」的阶数，就不能简化，只能「**近似简化**」，也就是后面要讲的 Jordan 标准型。现在我们先来看特征向量的个数等于「初始矩阵」的阶数这个情况，此时就可以简化，也就是**对角化**，也就是用一个「**对角矩阵**」去表示「初始矩阵」。

具体做法是构造一个「**特征矩阵**」，顾名思义，就是特征向量构成的矩阵。前文说过：「矩阵，可以理解为**线性变换**，有两种看法。第一种看法是：矩阵表示对基向量的变换；第二种看法是：矩阵表示新的基向量，都一样。」在「初始矩阵」的左边，我们先乘上一个「特征矩阵」，使用第二种看法去看待，基向量就会变成特征向量。然后我们知道，「初始矩阵」所对应的线性变换，在「特征矩阵」这里，就是普普通通的伸缩，因此就是左乘一个**对角向量**。然后我们再左乘一个「逆特征矩阵」，就可以回到「初始矩阵」了。
$$
A = \underbrace{P}_{\text{reverse back}} \;\underbrace{\Lambda}_{\text{scaling}}\; \underbrace{P^{-1}}_{\text{eigenmatrix}}
$$

There is a bit of a problem here. How should I view this matter? The linear transformation represented by matrix A is just ordinary scaling at the eigenmatrix.
1. I first transform the vector from being based on the basis vectors of the "initial matrix" to being based on the basis vectors of the "eigenmatrix," then perform the linear transformation in the "eigencoordinate system," and then transform it back to the "initial coordinate system."
It feels a bit strange here; clearly it is easy to understand...