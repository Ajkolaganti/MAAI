import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('prompt', prompt);
    
    const systemPrompt = `You are a world-class UI/UX designer and expert React developer specializing in creating premium, high-end landing pages. Generate sophisticated and visually stunning React components using Tailwind CSS.

Important: Return ONLY the React component code without any markdown formatting, code blocks, or explanation.

Design requirements:
- Craft visually striking hero sections with compelling headlines and subheadings
- Utilize modern glassmorphism effects (e.g., bg-opacity-10, backdrop-blur-lg)
- Implement smooth hover animations and transitions
- Use sophisticated gradients and color schemes (e.g., bg-gradient-to-r)
- Apply elegant typography with premium fonts
- Add proper spacing, padding, and alignment
- Include interactive elements with subtle animations
- Use high-quality images and icons (placeholders)
- Create engaging call-to-action buttons with hover effects
- Incorporate subtle shadows and depth for a layered look
- Ensure a cohesive and luxurious aesthetic throughout
- Design for both dark and light modes with appropriate color palettes

Technical requirements:
- Use only Tailwind CSS for styling
- Make components fully responsive and mobile-friendly
- Use semantic HTML5 elements
- Write clean, well-structured JavaScript code (no TypeScript)
- Avoid external dependencies and libraries
- Ensure compatibility with React 17 and standard browsers

Required sections:
1. Navigation bar with glass effect and logo placeholder
2. Hero section with gradient background and compelling copy
3. Features section showcasing benefits with modern cards
4. Testimonials or social proof with avatars
5. Interactive call-to-action section
6. Footer with links and contact information`;

    const userPrompt = `Please generate the complete code for a premium, React functional component for: ${prompt}. The component should be a fully-featured landing page with advanced UI elements, smooth animations, interactive components, and a luxurious, well-designed aesthetic.

Instructions:
- Return only the code for the React component.
- Do not include any explanations, introductions, or closing remarks.
- Do not include any comments in the code.
- The code should be in plain JavaScript (no TypeScript).
- Use only React and Tailwind CSS.
- Do not require any external libraries or dependencies.
- The code should be compatible with React 17.
- Avoid using features not supported in standard browsers.

Return only the code without any additional text or formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    let reactCode = completion.choices[0].message?.content?.trim() ?? '';

    // Remove any text before or after the code
    const codeMatch = reactCode.match(/(?:```jsx|```javascript|```)([\s\S]*?)(?:```|$)/);
    if (codeMatch) {
      reactCode = codeMatch[1].trim();
    } else {
      // If no code fences are found, attempt to extract code by removing non-code lines
      reactCode = reactCode
        .split('\n')
        .filter(line => !line.startsWith('Here') && !line.startsWith('Sure') && !line.trim().startsWith('//'))
        .join('\n')
        .trim();
    }

    // Modify the code
    const modifiedCode = reactCode
      .replace(/import\s+.*from\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s+default\s+(\w+);?/, 'const PreviewComponent = $1;')
      .replace(/export\s+{\s*[^}]*\s*};?/g, '')
      .replace(/module\.exports\s+=\s+\w+;?/, '')
      .replace(/export\s+const\s+(\w+)/g, 'const $1')
      .replace(/export\s+function\s+(\w+)/g, 'function $1')
      .replace(/export\s+\{[^}]+\};?/g, '')
      .replace(/interface\s+\w+\s+{[^}]*}/g, '')
      .replace(/type\s+\w+\s+=\s+{[^}]*}/g, '')
      .trim();
      
    return NextResponse.json({
      react: reactCode,
      modifiedCode: modifiedCode
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}