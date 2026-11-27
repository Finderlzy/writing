---
title: "Simplifying Matrices with Eigenvalues and Eigenvectors"
permalink: "en/matrix-diagonalization-notes"
description: "Starting from the definitions of eigenvalues and eigenvectors, this explains how to diagonalize a matrix using eigenvectors as a basis, thereby simplifying matrix powers, and outlines the steps for computing eigenvalues and eigenvectors and determining diagonalizability."
created: 2026-11-17
tags:
  - "linear-algebra"
  - "eigenvalues"
  - "eigenvectors"
  - "matrix-diagonalization"
  - "learning"
---
## The Problem
---
Today's problem is: **how do we simplify a matrix**?


## Eigenvectors and Eigenvalues
---
As we know, a matrix can be understood as a linear transformation. In some linear transformations, we can find that some vectors, after the transformation, still point in their original direction—they have simply been stretched. Such vectors are **eigenvectors**, and the factor by which they are stretched after the transformation is the **eigenvalue**.


## How Eigenvectors Simplify the "Initial Matrix"
---
If a 2×2 matrix has two **non-collinear (that is, linearly independent)** eigenvectors, we can use these two eigenvectors as basis vectors, thereby simplifying the matrix. Likewise, a 3×3 matrix that has three linearly independent eigenvectors can use these three vectors as basis vectors.

Why can using eigenvectors as basis vectors simplify a matrix? Let the original matrix be called the "initial matrix." The "initial matrix" can be viewed as first using a matrix (call it the "transformation matrix") to convert to a coordinate system whose basis is the eigenvectors; then using a matrix to stretch, so this matrix will be a **diagonal matrix**; and finally using the inverse of the first matrix to transform back.  ^92d134

Written as an equation (note that matrix multiplication is read from right to left—the rightmost matrix acts on the vector first):

$$
A = \underbrace{P}_{\text{逆向回去}} \;\underbrace{\Lambda}_{\text{伸缩}}\; \underbrace{P^{-1}}_{\text{转换矩阵}}
$$

At first glance this looks complicated, but just think: if there are many, many "initial matrices" multiplied together, computing them one by one would take forever. But using the simplified matrix, we find that the "inverse transformation matrix" of the first cancels with the "transformation matrix" of the second, so the final result is:

$$
\begin{aligned}
A^n &= (P\Lambda P^{-1})(P\Lambda P^{-1})\cdots(P\Lambda P^{-1}) \\
&= P\Lambda\,(P^{-1}P)\,\Lambda\,(P^{-1}P)\cdots\Lambda P^{-1} \\
&= P\Lambda^n P^{-1}
\end{aligned}
$$

And for the n-th power of a diagonal matrix, we only need to raise each number on the diagonal to the n-th power:

$$
\Lambda^n =
\begin{pmatrix}
\lambda_1 & 0 \\
0 & \lambda_2
\end{pmatrix}^n
=
\begin{pmatrix}
\lambda_1^n & 0 \\
0 & \lambda_2^n
\end{pmatrix}
$$


## How to Compute Eigenvectors and Simplify a Matrix
---
Having understood the above, we can move to the next step: how do we compute the eigenvectors of a matrix and simplify the matrix?


### Core Principle

From the definition of an eigenvector, we can easily obtain a core formula: $A \vec{x} = λ \vec{x}$ , where $\vec{x}$ is the eigenvector. Then, after some manipulation:

$$
\begin{aligned}
& A\vec{x} = \lambda\vec{x} \\
\Rightarrow\; & A\vec{x} - \lambda\vec{x} = \vec{0} \\
\Rightarrow\; & A\vec{x} - \lambda I\vec{x} = \vec{0} \\
\Rightarrow\; & (A - \lambda I)\vec{x} = \vec{0}
\end{aligned}
$$

(In the middle, $\lambda\vec{x}$ must be written as $\lambda I\vec{x}$, because "a matrix minus a number" is undefined, whereas "a matrix minus a matrix" is defined, and $I\vec{x} = \vec{x}$ changes nothing.)

We then obtain the final core formula:
$$
[A - λ I] \vec{x} = 0
$$
Generally, we do not consider the case where $\vec{x}$ is the zero vector, so to satisfy the above equation there is only one condition: $|A - λI| = 0$ .


### Computing Eigenvalues

So the first step is to compute the eigenvalues, that is, to compute the determinant above. After computing them, check with two properties:
1. The sum of all eigenvalues = the sum of the main diagonal entries of matrix A (the trace): $\lambda_1 + \lambda_2 + \cdots + \lambda_n = a_{11} + a_{22} + \cdots + a_{nn} = \operatorname{tr}(A)$
2. The product of all eigenvalues = the determinant of matrix A: $\lambda_1 \lambda_2 \cdots \lambda_n = |A|$


### Computing Eigenvectors

After computing the eigenvalues, substitute each eigenvalue back into the system of equations $[A - λ I] \vec{x} = 0$ to solve for the eigenvectors. This step is exactly the **computation of homogeneous linear systems** learned earlier, because the right-hand side of the equation is 0.


### Diagonalizing the Matrix

If we obtain n linearly independent eigenvectors, we can simplify the matrix A, that is, **diagonalize** A; if we do not obtain n eigenvectors, we cannot simplify it.

We arrange the eigenvectors vertically into a matrix to obtain the "eigenvector matrix" P, and put the corresponding eigenvalues in the same order into the diagonal matrix $\Lambda$:

$$
P = \begin{pmatrix}
| & | & & | \\
\vec{x}_1 & \vec{x}_2 & \cdots & \vec{x}_n \\
| & | & & |
\end{pmatrix}
$$

$$
\Lambda = \begin{pmatrix}
\lambda_1 & 0 & \cdots & 0 \\
0 & \lambda_2 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & \lambda_n
\end{pmatrix}
$$

$$
A = P\Lambda P^{-1}
$$

(Equivalent form: $AP = P\Lambda$, which is just writing the n $A\vec{x}_i = \lambda_i\vec{x}_i$ side by side; multiplying both sides on the right by $P^{-1}$ gives the above equation. $P^{-1}$ exists precisely because these n eigenvectors are linearly independent.)


## A New Problem
---
At this point there is a small annoyance: to compute the eigenvectors, you have to compute all the way to the end, and you also need to know what the numbers in each row and column of the matrix are. Mathematicians have provided some methods to deal with these small annoyances.


### Dealing with "computing all the way to the end"

The first is to deal with the annoyance of "computing all the way to the end." To determine whether an n×n matrix A can be diagonalized—that is, whether we can gather n linearly independent eigenvectors—mathematicians found that after computing the eigenvalues, we can directly decide whether diagonalization is possible just by looking at the multiplicities of the eigenvalues and the number of free variables.

First check whether there are repeated roots: **if there are no repeated roots, it can be diagonalized directly**. If there are repeated roots, then for the repeated roots only, compute the rank of A − λI, and **check whether the number of free variables equals its multiplicity**. If all are equal, it means each eigenvalue provides a full set of directions, and together they add up to exactly n, so it can be diagonalized; if even one is not equal, it means that repeated root does not provide enough directions, so we cannot gather n, and it cannot be diagonalized. This way we do not need to actually solve for the eigenvectors, saving the tedious step of computing them.

The number of free variables equals the number of vectors in the fundamental solution system. √
"So **the number of free variables = how many independent directions this λ can provide**."???
(I still don't quite understand this part—eigenvalues—providing directions—repeated roots)


### Dealing with "also needing to know what the matrix is"

Next comes the trouble of having to know what a matrix is. (I didn't learn it well—I only know that you substitute matrix A into the characteristic equation, and then the result of this system of equations will definitely be 0. There's also something about $m(x)$, minimal polynomials, and so on, which I don't really understand either.