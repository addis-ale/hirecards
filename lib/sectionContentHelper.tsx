import React from "react";
import { ChevronRight, Edit2 } from "lucide-react";

/**
 * Determines if section content should be shown inline or in a modal
 * Returns true if content should be shown inline (no modal needed)
 * Only JD sections and message templates section should use modals
 */
export function shouldShowInline(content: React.ReactElement, sectionId?: string): boolean {
  // These sections use modal (very large or complex content)
  if (sectionId === 'full-jd' || sectionId === 'templates' || sectionId === 'score-impact') {
    return false;
  }

  // All other sections show inline (including jd-rewrite)
  return true;
}

/**
 * Gets a preview of the content for display in the card
 */
export function getContentPreview(content: React.ReactElement, sectionId?: string): string {
  const props = content.props || {};

  // Special handling for full-jd: extract EditableText from nested div
  if (sectionId === 'full-jd' && props.children) {
    const children = React.Children.toArray(props.children);
    for (const child of children) {
      if (React.isValidElement(child) && child.type) {
        const childType = child.type as any;
        // Check if it's EditableText or has EditableText inside
        if (childType.name === 'EditableText' || childType.displayName === 'EditableText') {
          const childProps = child.props || {};
          if (childProps.value && typeof childProps.value === 'string') {
            if (childProps.value.length === 0) {
              return 'Your generated job description will appear here. We create a complete, market-fitting JD based on your role requirements.';
            }
            // Show first 200 characters of the JD
            const preview = childProps.value.substring(0, 200);
            return preview + (childProps.value.length > 200 ? '...' : '');
          }
        }
        // Check nested children for EditableText
        if (child.props && child.props.children) {
          const nestedChildren = React.Children.toArray(child.props.children);
          for (const nested of nestedChildren) {
            if (React.isValidElement(nested)) {
              const nestedProps = nested.props || {};
              if (nestedProps.value && typeof nestedProps.value === 'string') {
                if (nestedProps.value.length === 0) {
                  return 'Your generated job description will appear here. We create a complete, market-fitting JD based on your role requirements.';
                }
                const preview = nestedProps.value.substring(0, 200);
                return preview + (nestedProps.value.length > 200 ? '...' : '');
              }
            }
          }
        }
      }
    }
    return 'Your generated job description will appear here. We create a complete, market-fitting JD based on your role requirements.';
  }

  // EditableText preview
  if (props.value && typeof props.value === 'string') {
    if (props.value.length <= 150) {
      return props.value;
    }
    return props.value.substring(0, 120) + '...';
  }

  // EditableList preview
  if (props.items && Array.isArray(props.items)) {
    if (props.items.length === 0) return 'No items';
    if (props.items.length <= 3) {
      return props.items.join(' • ');
    }
    return props.items.slice(0, 2).join(' • ') + ` • +${props.items.length - 2} more`;
  }

  // EditableKeyValue preview
  if (props.data && Array.isArray(props.data)) {
    if (props.data.length === 0) return 'No data';
    if (props.data.length <= 2) {
      return props.data.map((item: any) => `${item.label}: ${item.value}`).join(' • ');
    }
    return props.data.slice(0, 1).map((item: any) => `${item.label}: ${item.value}`).join(' • ') + ` • +${props.data.length - 1} more`;
  }

  // Special handling for ScoreImpactTable
  if (sectionId === 'score-impact' && props.rows && Array.isArray(props.rows)) {
    const rows = props.rows;
    const totalUplift = props.totalUplift || '';
    if (rows.length === 0) {
      return 'No fixes available';
    }
    // Show first 2-3 fixes with their impacts
    const previewFixes = rows.slice(0, 2).map((row: any) => `${row.fix} (${row.impact})`).join(' • ');
    const remaining = rows.length - 2;
    if (remaining > 0) {
      return `${previewFixes} • +${remaining} more fixes${totalUplift ? ` • Total: ${totalUplift}` : ''}`;
    }
    return `${previewFixes}${totalUplift ? ` • Total: ${totalUplift}` : ''}`;
  }

  return 'Click to view details';
}

/**
 * Gets the title color class based on tone
 */
function getTitleColorClass(tone?: string): string {
  const toneColors: Record<string, string> = {
    info: "text-blue-700",
    warning: "text-amber-700",
    purple: "text-purple-700",
    success: "text-emerald-700",
    danger: "text-red-700",
    default: "text-[#102a63]",
  };
  return toneColors[tone || "default"] || toneColors.default;
}

/**
 * Renders content preview for card display with title and edit button
 */
export function renderContentPreview(
  content: React.ReactElement,
  isSmall: boolean,
  title?: string,
  onEdit?: () => void,
  tone?: string,
  sectionId?: string,
  allowEdit: boolean = true
): React.ReactNode {
  const titleColorClass = getTitleColorClass(tone);
  
  if (isSmall) {
    // Show full content inline with title and edit button
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-bold ${titleColorClass}`}>{title}</h3>
          {allowEdit && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit content"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
        </div>
        {/* Wrap content in neutral text color container - override colored text to gray for better readability */}
        <div className="[&_*]:!text-gray-700">
          {content}
        </div>
      </div>
    );
  }

  // Show preview with "See more" indicator, title and edit button
  const preview = getContentPreview(content, sectionId);
  
  // Special styling for full-jd and score-impact sections
  const isFullJd = sectionId === 'full-jd';
  const isScoreImpact = sectionId === 'score-impact';
  
  // Get totalUplift for score-impact messaging
  const totalUplift = isScoreImpact && content.props?.totalUplift ? content.props.totalUplift : null;
  const fixCount = isScoreImpact && content.props?.rows ? content.props.rows.length : 0;
  
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-bold ${titleColorClass}`}>{title}</h3>
        {allowEdit && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit content"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}
      </div>
      {isFullJd && (
        <p className="text-xs text-blue-600 mb-1.5 font-medium">
          ✨ We&apos;ve generated your complete job description based on your role requirements
        </p>
      )}
      {isScoreImpact && (
        <p className="text-xs text-emerald-600 mb-1.5 font-medium">
          🎯 {fixCount} actionable fixes to boost your hiring score{totalUplift ? ` by up to ${totalUplift}` : ''}. Click to see details and accept fixes!
        </p>
      )}
      <div className={`text-xs text-gray-700 ${isFullJd ? 'line-clamp-5' : isScoreImpact ? 'line-clamp-4' : 'line-clamp-3'} mb-2 ${isFullJd ? 'whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded border border-gray-200' : ''}`}>
        {preview}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onEdit) onEdit();
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#278f8c] hover:bg-[#1a6764] text-white text-xs font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
      >
        <span>See more</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

