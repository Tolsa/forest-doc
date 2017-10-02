# Install
```
$ gem install jekyll bundler s3_website
$ bundle install
```

# Run
```
$ bundle exec jekyll serve
```

# Deploy
Ensure you have a `.env` file containing S3_ID and S3_SECRET environment variables.

```
$ JEKYLL_ENV=production bundle exec jekyll build
$ s3_website push
```
