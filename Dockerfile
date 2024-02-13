# Use the ASP.NET Core runtime image as the base image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Copy the CSPROJ file and restore any .NET dependencies
COPY ["WorkManagement.csproj", "./"]
RUN dotnet restore "WorkManagement.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR "/src/"
RUN dotnet build "WorkManagement.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "WorkManagement.csproj" -c Release -o /app/publish

# Build the runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorkManagement.dll"]