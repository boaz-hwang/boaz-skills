# Domain-Specific Debugging Checklists

## A. Streaming/Buffer Issues

### Symptoms
- [ ] Video/audio stuttering or freezing
- [ ] Increasing latency over time
- [ ] Frame drops or artifacts
- [ ] "Buffer underrun" or "overflow" errors

### Investigation Checklist

**1. Buffer Configuration**
- [ ] Buffer size appropriate for data rate?
- [ ] Ring buffer vs linear buffer — correct choice?
- [ ] Buffer count sufficient for pipeline depth?

**2. Flow Control**
- [ ] Producer faster than consumer? (overflow)
- [ ] Consumer faster than producer? (underrun)
- [ ] Backpressure mechanism in place?
- [ ] Flow control signals being respected?

**3. Timing & Synchronization**
- [ ] Clock drift between producer/consumer?
- [ ] Timestamps monotonically increasing?
- [ ] Frame timing consistent?
- [ ] PTS/DTS handling correct?

**4. Codec & Format**
- [ ] Codec parameters match between encoder/decoder?
- [ ] Resolution/framerate changes handled?
- [ ] Keyframe interval appropriate?

**5. Resource Contention**
- [ ] CPU saturation during encoding/decoding?
- [ ] Memory pressure causing GC pauses?
- [ ] I/O blocking the pipeline?

---

## B. BLE/UART Communication

### Symptoms
- [ ] Connection drops
- [ ] Data corruption
- [ ] Timeout errors
- [ ] Pairing failures

### Investigation Checklist

**1. Physical Layer (UART)**
- [ ] Baud rate matching on both ends?
- [ ] Correct parity, stop bits, flow control?
- [ ] Cable/connection quality verified?
- [ ] TX/RX not swapped?

**2. Connection State (BLE)**
- [ ] Device in discoverable/connectable mode?
- [ ] Correct service UUID being used?
- [ ] Connection interval appropriate?
- [ ] MTU negotiated successfully?

**3. Protocol Layer**
- [ ] Message framing correct?
- [ ] Checksums/CRCs matching?
- [ ] Sequence numbers handled?
- [ ] ACK/NAK protocol working?

**4. Timing**
- [ ] Timeouts set appropriately?
- [ ] Retry logic in place?
- [ ] Debouncing for connection state?

**5. Power Management**
- [ ] Device entering sleep during communication?
- [ ] Wake-up latency accounted for?
- [ ] Battery level affecting transmission power?

---

## C. AI Inference Bottlenecks

### Symptoms
- [ ] Slow inference time
- [ ] High latency
- [ ] Memory exhaustion
- [ ] GPU underutilization

### Investigation Checklist

**1. Input Pipeline**
- [ ] Preprocessing on CPU vs GPU?
- [ ] Data loading blocking inference?
- [ ] Input normalization correct?
- [ ] Batch size optimal?

**2. Model Loading**
- [ ] Model loaded to correct device (CPU/GPU)?
- [ ] Warmup run completed?
- [ ] Model quantized if needed?
- [ ] ONNX/TensorRT optimization applied?

**3. Memory Management**
- [ ] GPU memory sufficient?
- [ ] Memory fragmentation?
- [ ] Tensor allocation overhead?
- [ ] Gradient tensors disabled for inference?

**4. Batching**
- [ ] Batch size vs latency tradeoff understood?
- [ ] Dynamic batching configured?
- [ ] Padding overhead minimized?

**5. Output Processing**
- [ ] Post-processing bottleneck?
- [ ] NMS (Non-Max Suppression) optimized?
- [ ] Output copying back to CPU?

---

## D. System Observability

### Symptoms
- [ ] "Unknown" failures
- [ ] Intermittent issues hard to diagnose
- [ ] Production differs from dev
- [ ] No visibility into system state

### Investigation Checklist

**1. Metrics (USE Method)**
- [ ] CPU utilization tracked?
- [ ] Memory utilization tracked?
- [ ] Disk I/O utilization tracked?
- [ ] Network utilization tracked?
- [ ] Saturation (queues) visible?
- [ ] Error rates captured?

**2. Logging**
- [ ] Structured logging in place?
- [ ] Log levels appropriate?
- [ ] Request IDs/correlation IDs?
- [ ] Sensitive data redacted?

**3. Tracing**
- [ ] Distributed tracing enabled?
- [ ] Span context propagated?
- [ ] Critical paths traced?
- [ ] Trace sampling rate appropriate?

**4. Alerting**
- [ ] SLOs defined?
- [ ] Alert thresholds tuned?
- [ ] Alert fatigue addressed?
- [ ] Runbooks linked to alerts?

---

## E. Network/API Issues

### Symptoms
- [ ] Connection refused/timeout
- [ ] Slow responses
- [ ] Intermittent failures
- [ ] SSL/TLS errors

### Investigation Checklist

**1. Connectivity**
- [ ] DNS resolution working?
- [ ] Port accessible (firewall)?
- [ ] Route to host exists?
- [ ] VPN/proxy configured?

**2. TLS/SSL**
- [ ] Certificate valid and not expired?
- [ ] Certificate chain complete?
- [ ] TLS version compatible?
- [ ] Cipher suites matching?

**3. Request/Response**
- [ ] Request format correct?
- [ ] Headers set properly (auth, content-type)?
- [ ] Response parsed correctly?
- [ ] Error responses handled?

**4. Timeouts**
- [ ] Connection timeout set?
- [ ] Read timeout set?
- [ ] Total request timeout set?
- [ ] Retry with backoff implemented?

**5. Rate Limiting**
- [ ] Rate limits known?
- [ ] 429 responses handled?
- [ ] Retry-After header respected?
- [ ] Client-side throttling in place?

---

## F. Memory/Crash Issues

### Symptoms
- [ ] Segmentation fault
- [ ] Out of memory (OOM)
- [ ] Memory growing over time
- [ ] Crash dumps

### Investigation Checklist

**1. Crash Analysis**
- [ ] Stack trace available?
- [ ] Core dump captured?
- [ ] Signal type (SIGSEGV, SIGABRT)?
- [ ] Faulting address meaningful?

**2. Memory Leaks**
- [ ] Memory profile taken over time?
- [ ] Allocations tracked to source?
- [ ] Circular references possible?
- [ ] Cache eviction working?

**3. Use-After-Free**
- [ ] Object lifetime clear?
- [ ] Dangling pointers possible?
- [ ] Double-free possible?

**4. Buffer Overflow**
- [ ] Array bounds checked?
- [ ] String operations safe?
- [ ] Stack canaries enabled?

**5. OOM**
- [ ] Memory limits configured?
- [ ] Swap enabled/disabled?
- [ ] Large allocations identified?
- [ ] Memory fragmentation?

---

## G. App Debugging

### Symptoms
- [ ] App crash
- [ ] UI freeze
- [ ] State inconsistency
- [ ] Battery drain

### Investigation Checklist

**1. Lifecycle**
- [ ] Correct lifecycle callbacks?
- [ ] State saved on background?
- [ ] Resources released on pause?
- [ ] Orientation change handled?

**2. Threading**
- [ ] UI work on main thread only?
- [ ] Long operations on background?
- [ ] Thread safety for shared state?
- [ ] Deadlock possible?

**3. State Management**
- [ ] State mutation predictable?
- [ ] State persistence working?
- [ ] State restoration working?
- [ ] Race conditions in state updates?

**4. Resource Leaks**
- [ ] Listeners unregistered?
- [ ] Subscriptions cancelled?
- [ ] Bitmaps/buffers recycled?
- [ ] Database connections closed?

**5. Performance**
- [ ] Layout passes optimized?
- [ ] Overdraw minimized?
- [ ] List recycling working?
- [ ] Animation frame drops?

---

## H. Web Debugging (Playwright MCP)

### Symptoms
- [ ] Test flakiness
- [ ] Element not found
- [ ] Timeout errors
- [ ] Visual differences

### Investigation Checklist

**1. Element Selection**
- [ ] Selector stable (not index-based)?
- [ ] Element in viewport?
- [ ] Element not covered by overlay?
- [ ] iFrame context correct?

**2. Timing**
- [ ] Wait for network idle?
- [ ] Wait for animation complete?
- [ ] Explicit wait for condition?
- [ ] Timeout values appropriate?

**3. State**
- [ ] Cookies/storage set correctly?
- [ ] Auth state valid?
- [ ] Application state reset between tests?
- [ ] Mock data consistent?

**4. Network**
- [ ] API mocking configured?
- [ ] Network conditions simulated?
- [ ] Request interception working?
- [ ] Response validation?

**5. Visual Regression**
- [ ] Baseline images current?
- [ ] Viewport size consistent?
- [ ] Fonts loaded?
- [ ] Animation disabled for screenshots?

**6. Reproduction with Playwright MCP**
```
Steps to capture reproduction:
1. Record failing scenario
2. Capture DOM snapshot
3. Capture network waterfall
4. Capture console logs
5. Generate reproduction script
```
