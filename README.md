# SonarQube Bind DevOps Action

Configures DevOps integration in SonarQube.

## Example usage

```yaml
name: Main Workflow
jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: SonarQube Scan
      uses: sonarsource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      with:
        args: >
          -Dsonar.projectKey=aglensmith_${{ github.event.repository.name }}
    - name: SonarQube Bind DevOps
      uses: aglensmith/sonarqube-bind-devops-action@main
      with:
        sonarHostUrl: ${{ secrets.SONAR_HOST_URL }}
        sonarToken: ${{ secrets.SONAR_TOKEN }}
        almSetting: localhost-austins-sonarqube
        project: aglensmith_${{ github.event.repository.name }}
        repository: ${{ github.event.repository.full_name }}
        summaryCommentEnabled: true 
        monorepo: false
```