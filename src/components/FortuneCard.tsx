import type { FortuneSection } from '../types/saju.types';

interface FortuneCardProps {
  section: FortuneSection;
  isStreaming?: boolean;
}

function renderStars(count?: number) {
  if (!count) return null;
  return (
    <div className="flex gap-0.5 mb-2">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'text-gold-400' : 'text-gray-600'}>
          ⭐
        </span>
      ))}
    </div>
  );
}

function renderMarkdown(text: string): string {
  // Simple markdown rendering for tables and basic formatting
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Table rows
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      return '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
    });

  // Wrap consecutive table rows
  html = html.replace(/((?:<tr>.*?<\/tr>\n?)+)/g, '<table>$1</table>');
  // Remove separator rows like |---|---|
  html = html.replace(/<tr><td>[-:]+<\/td>.*?<\/tr>/g, '');
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<table>/g, '<table>');
  html = html.replace(/<\/table>\s*<\/p>/g, '</table>');

  return html;
}

export default function FortuneCard({ section, isStreaming }: FortuneCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/[0.07] transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{section.emoji}</span>
        <h3 className="text-lg font-bold text-white">{section.label}</h3>
      </div>

      {/* Stars */}
      {renderStars(section.stars)}

      {/* Content */}
      <div
        className="fortune-content text-gray-300 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
      />

      {/* Streaming cursor */}
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-gold-400 animate-blink ml-1" />
      )}
    </div>
  );
}
