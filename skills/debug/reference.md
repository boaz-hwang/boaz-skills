# Debugging Tool Reference

Quick reference for common debugging tools and commands.

---

## System Observation

### Process Information
```bash
# List processes
ps aux | grep <name>
pgrep -a <pattern>

# Process tree
pstree -p <pid>

# Real-time process monitoring
top -p <pid>
htop

# Process file descriptors
lsof -p <pid>

# Process memory map
pmap <pid>
cat /proc/<pid>/maps
```

### System Calls
```bash
# Trace system calls
strace -f -p <pid>
strace -e trace=network <command>
strace -e trace=file <command>

# macOS
dtruss -p <pid>

# Count system calls
strace -c <command>
```

### Library Calls
```bash
# Trace library calls
ltrace -p <pid>
ltrace -e malloc+free <command>
```

### Kernel Messages
```bash
# Kernel ring buffer
dmesg -T
dmesg -T | tail -50
dmesg -w  # follow mode

# Journal (systemd)
journalctl -f
journalctl -u <service>
journalctl --since "5 minutes ago"
```

---

## Network Debugging

### Connectivity
```bash
# DNS resolution
dig <domain>
nslookup <domain>
host <domain>

# Port check
nc -zv <host> <port>
telnet <host> <port>

# Route tracing
traceroute <host>
mtr <host>

# Active connections
ss -tuln
netstat -tuln
lsof -i :<port>
```

### Packet Capture
```bash
# tcpdump basics
tcpdump -i <interface>
tcpdump -i any port <port>
tcpdump -i any host <ip>
tcpdump -w capture.pcap

# HTTP traffic
tcpdump -A -s0 port 80

# With Wireshark
wireshark -k -i <interface>
tshark -i <interface> -Y "http"
```

### HTTP/API Testing
```bash
# curl basics
curl -v <url>
curl -X POST -H "Content-Type: application/json" -d '{}' <url>
curl -w "@curl-format.txt" -o /dev/null -s <url>

# curl timing template (curl-format.txt)
# time_namelookup: %{time_namelookup}
# time_connect: %{time_connect}
# time_appconnect: %{time_appconnect}
# time_pretransfer: %{time_pretransfer}
# time_starttransfer: %{time_starttransfer}
# time_total: %{time_total}

# HTTPie (human-friendly)
http GET <url>
http POST <url> key=value
```

### SSL/TLS
```bash
# Certificate info
openssl s_client -connect <host>:443
openssl s_client -connect <host>:443 -servername <sni>

# Certificate expiry
echo | openssl s_client -connect <host>:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Performance Profiling

### CPU Profiling
```bash
# perf (Linux)
perf record -g <command>
perf report
perf top

# CPU flame graph
perf record -F 99 -g <command>
perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg

# time command
time <command>
/usr/bin/time -v <command>
```

### Memory Profiling
```bash
# Process memory
free -h
vmstat 1
cat /proc/<pid>/status | grep -i mem

# Heap analysis (Linux)
valgrind --tool=massif <command>
ms_print massif.out.*

# Address sanitizer
CFLAGS="-fsanitize=address" make
ASAN_OPTIONS=detect_leaks=1 ./<program>
```

### I/O Profiling
```bash
# Disk I/O
iostat -x 1
iotop

# File I/O per process
strace -e trace=read,write -c <command>
```

---

## Language-Specific

### Python
```bash
# Profiling
python -m cProfile -s cumtime script.py
python -m py_spy top --pid <pid>
python -m py_spy record -o profile.svg --pid <pid>

# Memory
python -m memory_profiler script.py
tracemalloc  # in code

# Debugging
python -m pdb script.py
python -c "import pdb; pdb.pm()"  # post-mortem
```

### Node.js
```bash
# Profiling
node --prof app.js
node --prof-process isolate*.log > processed.txt

# Memory
node --expose-gc --inspect app.js
# Use Chrome DevTools Memory tab

# Debugging
node --inspect app.js
node --inspect-brk app.js  # break on start
```

### Go
```bash
# Profiling
go tool pprof http://localhost:6060/debug/pprof/profile
go tool pprof http://localhost:6060/debug/pprof/heap

# Race detection
go run -race main.go
go test -race ./...

# Debugging
dlv debug main.go
dlv attach <pid>
```

### Rust
```bash
# Profiling
cargo flamegraph
perf record --call-graph dwarf cargo run

# Memory
cargo +nightly miri test  # undefined behavior

# Debugging
rust-gdb target/debug/<binary>
rust-lldb target/debug/<binary>
```

---

## Container/Docker

```bash
# Container logs
docker logs -f <container>
docker logs --tail 100 <container>

# Container inspection
docker inspect <container>
docker stats <container>
docker top <container>

# Execute in container
docker exec -it <container> sh
docker exec -it <container> bash

# Container health
docker inspect --format='{{.State.Health}}' <container>
```

---

## Kubernetes

```bash
# Pod logs
kubectl logs -f <pod>
kubectl logs -f <pod> -c <container>
kubectl logs --previous <pod>

# Pod inspection
kubectl describe pod <pod>
kubectl get pod <pod> -o yaml

# Execute in pod
kubectl exec -it <pod> -- sh
kubectl exec -it <pod> -c <container> -- bash

# Port forwarding
kubectl port-forward <pod> <local>:<remote>

# Events
kubectl get events --sort-by='.lastTimestamp'
```

---

## Git Debugging

```bash
# Find introducing commit
git bisect start
git bisect bad
git bisect good <commit>
# ... test each commit
git bisect reset

# Blame
git blame <file>
git log -p -S'<search string>'  # pickaxe

# Diff analysis
git diff HEAD~5..HEAD
git diff --stat
```

---

## Quick Recipes

### Find What's Using Port
```bash
lsof -i :<port>
ss -tulpn | grep :<port>
netstat -tulpn | grep :<port>
```

### Find Large Files
```bash
du -sh * | sort -rh | head -20
find . -type f -size +100M
```

### Watch File Changes
```bash
watch -n 1 'ls -la <file>'
tail -f <file>
```

### Compare Outputs
```bash
diff <(command1) <(command2)
vimdiff <(command1) <(command2)
```

### Measure Command Performance
```bash
hyperfine '<command1>' '<command2>'
time bash -c 'for i in {1..100}; do <command>; done'
```

### Capture and Replay Traffic
```bash
# Record
tcpdump -i any -w traffic.pcap

# Replay
tcpreplay -i <interface> traffic.pcap
```
