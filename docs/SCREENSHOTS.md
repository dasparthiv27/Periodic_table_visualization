# Manual Screenshot Checklist

Capture screenshots manually from the running application after checking that each view renders correctly. Use genuine app output, avoid personal data in the browser frame, and save approved images under `docs/screenshots/` with descriptive names. The directory and images do not exist yet.

- [ ] **Full application view** — desktop simulator with header, navigation, builder, visualization, table, and element details visible.
- [ ] **Periodic table and filtering** — show a real search or category filter and its matching result state.
- [ ] **Selected element and scientific properties** — select an element with several populated properties; include configuration and shell distribution.
- [ ] **Atom builder and particle counts** — show proton, neutron, and electron controls plus the derived mass number and charge.
- [ ] **Bohr-shell visualization** — capture the working SVG shell view.
- [ ] **3D nucleus visualization** — capture the working 3D view when WebGL is available; otherwise document the fallback separately.
- [ ] **Element comparison** — choose two different elements and show the side-by-side comparison table.
- [ ] **Mobile layout** — capture a narrow viewport showing navigation, stacked panels, and a usable horizontally scrollable periodic table.

Only the Bohr-shell SVG and 3D nucleus are currently working visualization modes. **Orbitals** and **3D Nucleon Physics** display placeholders and should not be captioned as completed visualizations.

After capture, add Markdown image links to the README Screenshots section, for example:

```markdown
![Atomic Explorer desktop simulator](docs/screenshots/desktop-simulator.png)
```

Use captions to identify viewport and feature. Do not add this link until the corresponding real image has been saved.
