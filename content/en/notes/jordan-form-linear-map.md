---
title: "Jordan Canonical Form: The Essence of a Linear Transformation"
permalink: "en/jordan-form-linear-map"
description: "Using the metaphor of a face, bare skin, and makeup, this explains how the transformation T, its Jordan form J, and a matrix A relate: J captures the structure of the transformation itself, while A = PJP⁻¹ is what it looks like after a change of basis, which sheds light on matrix similarity."
created: 2026-11-18
tags:
  - "linear-algebra"
  - "jordan-canonical-form"
  - "linear-transformation"
  - "similar-matrices"
  - "matrices"
---
The Jordan canonical form **describes the structure of the transformation itself that a matrix represents**. Here I think we need to distinguish three things: the transformation T itself, the Jordan canonical form J, and the matrix A we usually see.

Although the Jordan canonical form is also a matrix in form, I think it cannot be regarded as the same thing as A. These three things are somewhat like a face, a bare face, and makeup. T is the face—it is the transformation itself, with no numbers on it; J is the bare face, the original appearance of this face, recording whatever T has without losing any information about T; A is makeup. I can use different cosmetics (basis vectors) to put on makeup, thereby presenting different appearances (matrices), but I am still me.

**A matrix = choose a set of basis vectors, transform this set of basis vectors by the transformation T, and then use the same set of basis vectors to measure the coordinates**. Choosing the standard basis gives A, which is the vast majority of matrices we see in daily life; choosing the Jordan chain basis gives J. When no basis is specified, the standard basis is assumed by default.

A matrix-vector multiplication, then, views a vector as: using the set of basis vectors used by the matrix as a ruler, how many copies of each basis vector this vector takes, that is, its coordinates; the result of the multiplication is the coordinates of the transformed vector measured with the same set of basis vectors. Matrix multiplication views the right matrix as a set of vectors (a set of coordinates), recording each column of the result, and takes how many copies of each column of the left matrix (that is, the transformed basis vectors) to assemble it.  ^ee53da

The Jordan canonical form, however, records **the structure of the transformation itself**. Why can J represent T, while A cannot? My current understanding is that **A mixes two kinds of information: one is the structure of T, and the other is "which set of basis vectors we chose"**. The standard basis is chosen by us; change the basis, and the matrix changes, so just by looking at A, one cannot tell which numbers belong to T itself and which are brought in by the basis. The chain basis used by J, however, is not chosen by us; it grows out of T itself, so the information of the basis is removed, leaving only the structure of T: which λ's there are, how many chains each λ has, and how long each chain is. This is why J is said to be the bare face: a bare face is also a kind of "appearance", but this appearance is not given by cosmetics; it grows out of the face itself. There is another point: the chain basis itself is not unique; the same T can grow several sets of chain bases, but no matter which set is used, the measured J is the same (at most the order of blocks differs). Therefore, what J records can only be T's own things.

Take the following Jordan canonical form as an example to explain what is meant by "describes the structure of the transformation itself".

$$
J=\begin{pmatrix}
1 & 0 & & & & & \\
& 1 & 0 & & & & \\
& & 5 & 1 & & & \\
& & & 5 & 0 & & \\
& & & & -1 & 1 & \\
& & & & & -1 & 0 \\
& & & & & & 2
\end{pmatrix}
$$

**Read J column by column: the j-th column = the coordinates of T($c_j$) measured using c as basis vectors**. The number on the diagonal is how many times $c_j$ is stretched; if the entry above the diagonal is 1, it means that T($c_j$), besides being stretched, also shifts by one copy toward the next vector in the chain (that is, the column to the left); if the entry above is 0, it means this column is the beginning of a new chain, that is, the bottom of the chain, and it is a true eigenvector, only stretched, not shifted.

Counting from left to right, they are c1, c2, c3, c4, c5, c6, c7. This Jordan form says that what T does is: stretch c1 by a factor of 1, stretch c2 by a factor of 1, stretch c3 by a factor of 5 (only stretch, no shift; the 3rd column has only the 5 on the diagonal), stretch c4 by a factor of 5 and shift by one copy toward c3, stretch c5 by a factor of −1, stretch c6 by a factor of −1 and shift by one copy toward c5, and stretch c7 by a factor of 2. Written as equations, the 3rd column is $T(c_3)=5c_3$, and the 4th column is $T(c_4)=5c_4+c_3$.

Viewed by blocks, this is the entire structure of T:

- $\lambda=1$: two chains c1 and c2, each of length 1;
- $\lambda=5$: one chain $c_4 \to c_3$, of length 2, with c3 at the bottom of the chain;
- $\lambda=-1$: one chain $c_6 \to c_5$, of length 2, with c5 at the bottom of the chain;
- $\lambda=2$: one chain c7, of length 1.

The Jordan canonical form itself does not write who the basis vectors are; it only writes how each column changes: whichever vector you put in the first column, it stretches that vector by a factor of one; whichever vector you put in the fourth column, it stretches that vector by a factor of 5 and then shifts by one copy toward the vector in the third column. And so on, thereby obtaining the appearance of the matrix when that set of vectors is used as the basis vectors. There is a precondition here, though: the c's cannot be chosen arbitrarily; they must truly satisfy relations such as $T(c_4)=5c_4+c_3$, that is, they must be chains that grow out of T itself.

Looking back now, this sentence is actually talking about "makeup". **Written as an equation, makeup is $A=PJP^{-1}$**. The columns of P are the set of basis vectors I chose (note: **written in standard coordinates**), and I decide who this set of basis vectors is. **P is somewhat like a translator: given the coordinates of a vector in the new basis, P translates the position of this vector after the transformation into standard coordinates**. The same vector, measured with two rulers, gives different readings, but it is still the same vector.

----------------------------------------------------------------------------------

Here's a two-dimensional example.

$$
A=\begin{pmatrix} 3 & 1 \\ -1 & 1 \end{pmatrix},\quad
P=\begin{pmatrix} 1 & 1 \\ -1 & 0 \end{pmatrix},\quad
J=\begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix}
$$

The two columns of P are the basis I chose, $u_1 = (1,-1)$ and $u_2 = (1,0)$. Use A to transform them: $T(u_1) = (2,-2) = 2u_1$, $T(u_2) = (3,-1) = u_1 + 2u_2$. Then measure the coordinates using the u basis, and you get J. Reading column by column: the 1st column is $(2,0)$, $u_1$ stretched by a factor of 2, with 0 above, and $u_1$ is the bottom of the chain; the 2nd column is $(1,2)$, $u_2$ stretched by a factor of 2, then shifted by one copy toward $u_1$. So this T has only one chain $u_2 \to u_1$ of $\lambda=2$, of length 2.

Two rulers: the same vector $T(u_2)$, measured in the standard basis is $(3,-1)$, and measured in the u basis is $(1,2)$. This is the translation that P performs:

$$
P\begin{pmatrix} 1 \\ 2 \end{pmatrix}=1\cdot u_1+2\cdot u_2=\begin{pmatrix} 3 \\ -1 \end{pmatrix}
$$

So why is it $A=PJP^{-1}$? Look at the same batch of transformed vectors $T(u_1), T(u_2)$; their standard coordinates can be computed in two ways:

- Translate first, then transform: P first translates the u's into standard coordinates (which are exactly the columns of P), then transforms them with A, giving AP;
- Transform first, then translate: first transform in the u basis using J, giving the u coordinates of T(u's), then translate them into standard coordinates using P, giving PJ.

For the same batch of vectors, the two methods must give the same result, so $AP = PJ$:

$$
AP=PJ=\begin{pmatrix} 2 & 3 \\ -2 & -1 \end{pmatrix}
$$

Multiplying both sides by the reverse translator $P^{-1}$ gives $A=PJP^{-1}$. In other words, A is just the bare-faced J wearing the makeup kit P.

From this, we can easily understand the concept of "similarity": **two matrices are similar when the same face is wearing different makeup**. No matter what basis is used, as long as the two matrices are the same face behind the scenes—that is, they have the same Jordan canonical form (more precisely, **the same "Jordan blocks", though the order can differ**, a bit like a front-view photo and a side-view photo of the same face)—then the two matrices are similar.
