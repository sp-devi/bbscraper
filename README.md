# bbscraper

## Getting Started

Install dependecies:

```
$ npm install
```

Run program(start a task(via node-cron) that runs every five minutes)

```
$ node index.js
```

## Output

Results for each day is stored on _/output_. If there is a result on a specific
day, check the result against corresponding output file for any changes,
if a change is found, send mail and output the new data.

## Remaining task

 ・ Logging

 
 ・ Fix comments
 
 
 ・ Fix unhandled exception(puppeteer instance not catching error)
   - TODO: Wrap it inside async function

## Config files

Replace config files with your AWS credentials, target email address, etc...

## Contributing Code
If you would like to contribute features, refactor code, etc., please create or comment on an issue on this repo, and one of the core contributors listed below.
