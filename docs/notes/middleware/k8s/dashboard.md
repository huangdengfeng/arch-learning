# Kubernetes Dashboard
开源Kubernetes Dashboard 使用

## 安装
[https://github.com/kubernetes/dashboard](https://github.com/kubernetes/dashboard)
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
kubectl proxy
```

[访问](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)

## 访问token

https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

```shell
# 创建用户
kubectl apply -f dashboard-adminuser.yaml
# 生成token 可以多次
kubectl -n kubernetes-dashboard create token admin-user
```
```yaml
# dashboard-adminuser.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```