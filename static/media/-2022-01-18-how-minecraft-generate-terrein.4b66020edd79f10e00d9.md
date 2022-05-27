<!-- https://www.quora.com/How-does-Minecraft-generate-worlds -->

The technique is called procedural terrain generation.

When you walk into an area, Minecraft will evaluate a big mathematical function for every block in view. The result of the function is what type of block it is, it can be air, dirt, stone, etc.. It is the designer’s job to put this formula together in a way that it generates something fun.

Note this is a function in the true mathematical sense. If you evaluate this function 100 times on the same block, you will always get the same result. If the player walks away, Minecraft will destroy all the blocks. If he comes back, the function will generate the exact same terrain. If an area has not been altered, there is no need to save it, it can just be regenerated over and over. This is why a gigantic world in Minecraft does not take much space.

How does this function work?

Let’s start with a simple function first:

```math
              ⎧ dirt    if y ≤ 0
bock(x,y,z) = ⎨
              ⎩ air     otherwise
```

If I want to know what kind of block is at position (10,3,−5), I put that in the formula and I get 𝑎𝑖𝑟 if I want to know what is at position (5,−4,−5), I put that in the formula and I get 𝑑𝑖𝑟𝑡.

Well, that formula works, but it would give you a very boring terrain, just flat land.

There are some well known mathematical functions called coherent noise. A 1D coherent noise function typically looks like this:

Some well-known implementations are simplex noise and Perlin noise. What is important about these functions is that they are continuous (never jump), they are derivable (smooth, no edges), they can be evaluated for every number. The result is always within a predictable range [-1,1] and they look random (no repetitive pattern). They can also be seeded, if you give an initial value, then the noise function will produce a different curve that has the same characteristics.

This is what a 2D noise function looks like:

We can use noise to calculate the terrain height:

ℎ𝑒𝑖𝑔ℎ𝑡(𝑥,𝑧)=𝑛𝑜𝑖𝑠𝑒(𝑥/100,𝑧/100)×30

If I simply use (𝑥,𝑧), the mountains would be very narrow. To make them wide, I divide by 100, this is called the frequency. If I simply use the result of noise, the mountains would not be more than 1 block tall. I multiply by 30 to make them taller, this is called the amplitude.

Let’s use the ℎ𝑒𝑖𝑔ℎ𝑡 function for our terrain generation function:

```math
              ⎧ dirt    if y ≤ height(x,z)
bock(x,y,z) = ⎨
              ⎩ air     otherwise
```

With this formula, now we have some smooth valleys and hills. Something like this

Let’s add water:

```math
              ⎧ dirt    if y ≤ height(x,z)
bock(x,y,z) = ⎨ water   if y ≤ 0
              ⎩ air     otherwise
```

Every block below 0 (sea level) that is not dirt, will be water:

Minecraft combines multiple noise at different amplitudes and frequencies and other functions together to create more interesting stuff such as caves, rocks, mountain systems, ore, biomes, etc...

Here is a library and tutorial you can use to try out procedural terrain generation yourself: [Tutorial 1: Including the libnoise library](http://libnoise.sourceforge.net/tutorials/tutorial1.html)
