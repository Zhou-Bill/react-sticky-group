## Sticky

#### Demo

```jsx
const Demo = () => {
  return (
    <div style={{ height: '2000px' }}>
      <StickyGroup offsetTop={0}>
        <Sticky stickyKey='a'>
          <div style={{ background: 'yellow' }}>a</div>
        </Sticky>
        /** ..... */
        <Sticky stickyKey='b'>
          <div style={{ background: 'blue' }}>b</div>
        </Sticky>
      </StickyGroup>
    </div>
  )
}
```