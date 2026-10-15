# Atlas vector index for portfolio snapshots

Create the `portfolio_vectors` index on `portfolio_chunks`. The active snapshot is stored separately in `portfolio_snapshots` with `_id: "active"`; every search reads that pointer and filters vector results to its `generation`.

```json
{
  "name": "portfolio_vectors",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      { "type": "vector", "path": "embedding", "numDimensions": "<embedding-model-dimensions>", "similarity": "cosine" },
      { "type": "filter", "path": "generation" },
      { "type": "filter", "path": "slug" },
      { "type": "filter", "path": "type" }
    ]
  }
}
```

Set `numDimensions` to the configured embedding model’s actual output size. Do not omit `generation`: it is the safety boundary that prevents superseded, removed, or failed-stage rows from becoming evidence.
