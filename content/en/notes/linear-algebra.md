---
title: "Linear Algebra: Matrices, Elimination, and Determinants"
permalink: "en/linear-algebra"
description: "Starting from systems of linear equations, this post explores matrices as linear transformations, how elimination reveals the three cases for solutions, and the geometric meaning and computational properties of determinants, while listing open questions about rank and null space."
created: 2026-11-16
modified: 2026-11-17
tags:
  - "learning"
  - "linear-algebra"
  - "matrices"
  - "determinants"
  - "gaussian-elimination"
---
What problem is advanced algebra trying to solve? The old master Gilbert Strang says: "Linear algebra is used to compute **systems of linear equations**."

We all know what a system of equations is, so the only thing we need to figure out in this sentence is: what is "linear"?

Put simply, it means each unknown can only be to the **first power**, and the unknowns **cannot be multiplied by each other**, so things like $x^2$ and $xy$ don't count. If you draw it, a linear equation is a **straight line**—straight, it doesn't bend. The linear transformations 3B1B talks about mean the same thing: the origin stays fixed, and after the grid lines are transformed they are still straight, parallel, and evenly spaced.

A system of linear equations can be seen as a **coefficient matrix** made up of the coefficients of all the unknowns, multiplied by an **unknown vector** made up of the unknowns, giving the **final vector**, that is, $A\vec{x} = \vec{b}$.

A matrix can be understood as a **linear transformation**. So as long as this linear transformation is invertible, we just need to compute the inverse matrix of the current matrix. Let the final vector pass through the transformation of the inverse matrix, and we get the unknown vector.

1. Determine whether the linear transformation represented by this matrix is invertible. <—— determinant, rank
2. Compute the inverse matrix

After the afternoon's lesson, I found that although the above approach is quite smooth, the step "1. Determine whether the linear transformation represented by this matrix is invertible. <—— determinant, rank" actually also depends on elimination.

So the more general approach is to perform **elimination**, except using elimination in matrix form, and use the **last row** obtained from elimination to determine how many solutions the system has. You can compare it to a linear equation in one unknown, $ax = b$, to judge how many solutions the system has:

- $a ≠ 0$, there is a unique solution (**it doesn't matter what b is**), and normal back-substitution works. **Geometric interpretation: the linear transformation represented by this matrix does not compress space.**
    - For example, $x+y=3,\ x-y=1$, solving gives $x=2,\ y=1$. The two lines **intersect at one point**.
- $a = b = 0$, there are infinitely many solutions.
    - For example, $x+y=2,\ 2x+2y=4$, subtract 2 times the first row from the second row to get $0=0$. The second equation is just the first one multiplied by 2, a "copy", so there is one fewer useful equation, and the unknowns cannot be pinned down. The two lines **coincide**, and every point on the line is a solution.
- $a = 0;b ≠ 0$, no solution. Geometric interpretation: the linear transformation represented by this matrix compresses space, but the final vector is **not the zero vector**; it points to a vector outside the column space. The column space is **the set of all vectors** after the transformation, and if the final vector falls outside the column space, then naturally there is no solution.
    - For example, $x+y=2,\ 2x+2y=5$, elimination gives $0=1$, which is self-contradictory. The two lines are **parallel** and never meet.

This also explains why there are only these three cases: a line doesn't bend, so two lines cannot meet exactly twice. If the equation contains $x^2$, it draws a curve, and then it could have exactly two solutions.

Note that b here is the number on the right side of the **last row after elimination**, not the whole $\vec{b}$ from the beginning. My first version wrote "the final vector is the zero vector, so there are infinitely many solutions", which is wrong—in the example above, $\vec{b} = (2, 4)$, there are still infinitely many solutions.

Also, looking only at the last row assumes that the number of equations equals the number of unknowns. If they are not equal, you need to look at all the rows that are eliminated to all zeros.

Next, determinants. The geometric meaning of the determinant is: **the factor by which the linear transformation represented by the matrix corresponding to this determinant changes area**. If the determinant is 0, that is the "this linear transformation compresses space" mentioned earlier.

How to compute a determinant:  ^b59599
- Second-order determinant: product of the main diagonal - product of the anti-diagonal
- Third-order determinant: expand along the first row, then compute as second-order determinants

Some properties of determinants:
- Swapping rows and columns requires adding a negative sign
- Linear combinations do not affect the final result of the determinant
- Common factors can be factored out

Still not fully understood:
- **Rank**. Current understanding: rank = how many rows are left that are not all 0 after elimination = how many equations are actually useful. If the number of useful equations equals the number of unknowns, there is a unique solution; if it is less than the number of unknowns, there are infinitely many solutions. The formal notation $r(A) = r(A|\vec{b}) = n$ is still not clear to me; I only know that the **augmented matrix** $[A \mid \vec{b}]$ is just $\vec{b}$ appended to the right of $A$.
- When there are infinitely many solutions, what do all the solutions look like? I hear it's "a particular solution + null space"; I'll wait until homogeneous systems come up.
- Why is a matrix not invertible when the determinant is 0? Current understanding: determinant 0 = space has been flattened, and once flattened it cannot be restored.