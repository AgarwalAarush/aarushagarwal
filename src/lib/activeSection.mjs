// Use section starts, not intersection ratios: long sections should remain
// active until the next heading reaches the reading position near the top.
export function getActiveSection(sectionPositions, viewportHeight) {
  const readingPosition = Math.max(48, viewportHeight * 0.12);
  let activeId = sectionPositions[0]?.id;
  for (const section of sectionPositions) {
    if (section.top <= readingPosition) activeId = section.id;
  }
  return activeId;
}
