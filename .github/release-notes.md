{{ if .Version }}{{ .Version }}{{ else }}DRAFT{{ end }}

**Release Date:** {{ datetime "2006-01-02" }}

## What's Changed
{{ range .Changes }}
### {{ .Title }} ([#{{ .PR.Number }}]({{ .PR.URL }}))
{{ .Description }}
{{- end }}

## New Features
- [ ] 

## Fixed Issues
- [ ] 

## Known Issues
- [ ] 

## Upgrade Instructions
