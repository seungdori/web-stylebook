# webstylebook

Copies [Web Stylebook](https://webstylebook.com/pages/components) React components into your project. The source becomes yours to edit. The components need React 19 and nothing else.

```bash
npx webstylebook add toast tooltip
npx webstylebook list
```

Files go to `src/components/webstylebook/`, or to `components/webstylebook/` in a project with no `src` folder. Use `--dir` to choose another folder.

The command writes nothing if a file you changed would be replaced. Use `--overwrite` to replace the files of the components you named. The theme stays yours until you run `npx webstylebook add theme --overwrite`.

## License

MIT. The components are MIT too, so commercial projects can use them. A copy of the license installs next to them.
