# Tee’s Wardrobe — type scale

All 15 saved styles were reopened and checked in Figma on 2026-10-27. These are the applied values; this document is not a native Figma export.

```text
Style              Font   Weight  Size  Letter spacing  Line height  Multiplier
display/large      Inter  400    57    -4%             79.8         1.4
display/medium     Inter  400    45    -4%             63           1.4
display/small      Inter  400    36    -4%             50.4         1.4
headline/large     Inter  400    32    -4%             44.8         1.4
headline/medium    Inter  400    28    -4%             39.2         1.4
headline/small     Inter  400    24    -4%             33.6         1.4
title/large        Inter  500    22    -4%             30.8         1.4
title/medium       Inter  500    16    -4%             22.4         1.4
title/small        Inter  500    14    -4%             19.6         1.4
body/large         Inter  400    16    -4%             24           1.5
body/medium        Inter  400    14    -4%             22.4         1.6
body/small         Inter  400    12    -4%             19.2         1.6
label/large        Inter  500    14    -4%             19.6         1.4
label/medium       Inter  500    12    -4%             16.8         1.4
label/small        Inter  500    11    -4%             15.4         1.4
```

Regular means weight 400; Medium means weight 500. Size and line height are recorded in pixels. Letter spacing is a percentage of the font size.

## Why these roles differ

Display and Headline are short, prominent text. Title marks sections; Body carries order details; Label identifies controls and small supporting information. Most styles use a 1.4 multiplier for this class exercise, Body/Large uses 1.5, and Body/Medium and Small use 1.6 to give multi-line supporting text more room. These are deliberate project choices, not universal accessibility requirements or unchanged Material defaults.

Body/Large is the starting choice for order amounts, payment messages and ordinary essential reading. Small 11–12px styles are restricted to nonessential details and still need real phone reading checks. The presence of 15 styles in the library does not mean every screen should use all 15.

## Display Large spacing comparison

The two actual Figma exports use the same words, Inter Regular at 57px, 79.8px line height, colours and frame size. The reference reconstructs the original generated style’s -0.25px spacing with the current font; it is not a historical screenshot of the complete original Roboto style. The chosen saved style uses -4%, or -2.28px at this size.

In the pictures, the chosen sentence occupies less horizontal space and its letters sit closer together. The words are legible in this large sample, but this single example cannot prove that -4% is easy to read everywhere. Small labels and dense order details could feel crowded on a phone, so check real content on a phone and loosen spacing where needed.

Evidence: [reference](../evidence/03-spacing-default.png) and [chosen](../evidence/04-spacing-chosen.png).
