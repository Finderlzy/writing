---
title: "Meditations on Linear Algebra in Room 506, Yifu Building"
permalink: "en/awakening-in-yifu-506"
description: "Starting from matrices as linear transformations, this post derives the definitions and methods for finding eigenvalues…"
created: 2026-11-18
modified: 2026-11-27
tags:
  - "linear-algebra"
  - "linear-transformation"
  - "eigenvalues"
  - "eigenvectors"
  - "jordan-canonical-form"
---
> This is the kind of blog post I envision as ideal—gathering all my thoughts together, systematic, logical, and smooth. It is the product of continuously learning and thinking about a certain topic over a period of time, finally condensed into one piece.
> Perhaps I will always remember this day. There was an autumn wind that day, like the majesty emanating from a supreme sovereign; clearly he was just sitting there, doing nothing, yet I could only bow my head and crawl forward.

Let's start with matrices. A matrix can be understood as a **linear transformation**, and there are two ways to view it. The first view is: a matrix represents a transformation of the basis vectors; the second view is: a matrix represents new basis vectors, but note that the coordinates of the vectors do not change. Both views are the same. [[en/notes/jordan-form-linear-map#^ee53da|I lean toward the second view]], because the first view presupposes that the basis vectors are (1, 0) and (0, 1), that is, it presupposes a coordinate system.

During a linear transformation, some vectors **do not change direction** after the transformation; such vectors are **eigenvectors**. Although the direction does not change, they may be stretched or shrunk, and we call this scaling factor the "**eigenvalue**". Because [[en/notes/matrix-diagonalization-notes#^92d134|eigenvectors can be used to simplify a matrix]], we want to compute them.

From the definition of an eigenvector, we can obtain a formula $Ax=\lambda x$, whose geometric meaning is that after the vector x undergoes the linear transformation represented by matrix A, its direction is unchanged and it is only scaled by λ. Then, through simple algebraic manipulation, we can obtain the following expression (sometimes it is easy to understand things algebraically, so don't try to think about the geometric meaning, because you won't be able to figure it out):
$(A - \lambda I)x = 0$. Therefore, through simple algebraic operations, we know that **the eigenvectors are the basis vectors of the null space of the new matrix $(A - \lambda I)$**.

What is the "null space"? During a linear transformation, some dimensions disappear. For example, in three-dimensional space, if a matrix compresses the new vectors onto a plane, then one dimension has disappeared, and the null space is this line; still in three-dimensional space, if a matrix compresses the new vectors onto a line, then two dimensions have disappeared, and the null space is a plane. The null space is also a space; in other words, the null space also has basis vectors. The eigenvectors of a matrix are the null space basis vectors of the new matrix after algebraic manipulation... uh, actually they don't have to be basis vectors... actually we can also call them basis vectors, because as long as two vectors are linearly independent, they can be treated as basis vectors.

OK, back to the expression $(A - \lambda I)x = 0$; next we need to solve this equation. Because we do not consider the case where the vector x is the zero vector, for this expression to hold, it must be that $(A - \lambda I)=0$, that is, the determinant of the matrix $(A - \lambda I)$ is 0.

[[en/notes/linear-algebra#^b59599|How is the determinant computed]]? Two-dimensional, three-dimensional, triangle method simplification, properties (swapping rows and columns, factoring out common factors, adding rows and columns)

Thus we solve for the eigenvalue λ. Here is a conclusion: different λ correspond to different linearly independent eigenvectors. Therefore, if the computed λ are all different, this is a very good situation, and then we substitute each λ one by one and compute the system of equations $Bx=0$ to obtain the null space basis vectors of this matrix (would it be better to call it a fundamental system of solutions? or a linear combination of basis vectors?), and then each substitution of a λ yields an eigenvector, and finally we can obtain all the eigenvectors of the "initial matrix".

But if one or two of the computed λ are equal, that is, the so-called "repeated roots", then we need to discuss it. Substitute the repeated root λ into $(A - \lambda I)$ to obtain $Bx=0$, and then solve it by normal Gaussian elimination. Focus on the rank of the matrix after elimination. In other words, look at **the number of free variables** after elimination, because free variables correspond to the basis vectors of the null space (I can't say why this is so, but I think it is so).

Suppose the "initial matrix" is of order 3, and then $\lambda_1, \lambda_2=\lambda_3$; we substitute $\lambda_2$ into the "initial matrix" and then eliminate the new matrix. If the number of free variables is one, that is, the new matrix has only one null space basis vector, then from the above "**the eigenvectors are the basis vectors of the null space of the new matrix $(A - \lambda I)$**", we can obtain: the eigenvectors of the "initial matrix" are $1+1$, that is, 2; but if the number of free variables is two, that is, the new matrix has two null space basis vectors, then we can obtain: the eigenvectors of the "initial matrix" are $1+2=3$.

Why do these two different situations arise? My understanding is: λ only reflects the scaling factor of the eigenvectors and **does not indicate the direction of the eigenvectors**. I can have two collinear vectors, both with scaling factor λ, but from the perspective of dimension, they are only one-dimensional, not two-dimensional; that is, λ does not provide two directions.

OK, now we have calculated all the eigenvectors of the "initial matrix." If the number of eigenvectors is not equal to the order of the "initial matrix," it cannot be simplified and can only be **approximately simplified**, which is the Jordan canonical form discussed later. Now let us first look at the case where the number of eigenvectors equals the order of the "initial matrix." In this case, it can be simplified, that is, **diagonalized**, which means using a "**diagonal matrix**" to represent the "initial matrix."

The specific method is to construct an "**eigenmatrix**," which, as the name suggests, is a matrix formed by eigenvectors. As mentioned earlier: "A matrix can be understood as a **linear transformation**, and there are two ways to view it. The first view is: a matrix represents the transformation of basis vectors; the second view is: a matrix represents new basis vectors. Both are the same." On the left side of the "initial matrix," we first multiply by an "eigenmatrix." Using the second view, the basis vectors become eigenvectors. Then we know that the linear transformation corresponding to the "initial matrix" is, with respect to the "eigenmatrix," simply scaling, and therefore is left-multiplying by a **diagonal vector**. Then we left-multiply by an "inverse eigenmatrix," and we can return to the "initial matrix."
$$
A = \underbrace{P}_{\text{逆向回去}} \;\underbrace{\Lambda}_{\text{伸缩}}\; \underbrace{P^{-1}}_{\text{特征矩阵}}
$$

There is a bit of a problem here. How should I look at this? The linear transformation represented by matrix A is, with respect to the eigenmatrix, simply scaling.
1. I first convert the vector from being based on the basis vectors of the "initial matrix" to being based on the basis vectors of the "eigenmatrix," then perform the linear transformation in the "eigencoordinate system," and then convert it back to the "initial coordinate system."
It feels a bit strange here. It is clearly very easy to understand...