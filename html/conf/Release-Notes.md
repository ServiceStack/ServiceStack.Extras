#ServiceStack v2.06

## Finding Web.Config Nirvana

This release was focused on getting ServiceStack working consistently everywhere, ideally with the same configuration and binaries.



## Download
* [**New users should download ServiceStack.Examples - v2.06**](https://github.com/ServiceStack/ServiceStack.Examples/downloads)
* [Existing users can download just the ServiceStack.dlls - v2.06](https://github.com/ServiceStack/ServiceStack/downloads)

.

Follow [@demisbellot](http://twitter.com/demisbellot) and [@ServiceStack](http://twitter.com/ServiceStack) for twitter updates
*****

#ServiceStack v2.0

The ServiceStack code-base has gone under a re-structure to better support user contributions, testing, fine-grained deployments allowing hosting of ServiceStack in 32 and 64 bit servers, in medium or full trust hosting environments.

The changes from a high-level are:

  * No more ILMERGE.exe dlls, all ServiceStack .dlls now map 1:1 with a project of the same name
    * As a result all .pdb's for all assemblies are now included in each release to help debugging (this was lost using ILMERGE)
    * When not using OrmLite/Sqlite, ServiceStack is a full .NET managed assembly with no P/Invokes that can run in 32/64 bit hosts
  * All projects upgraded to VS.NET 2010 (min baseline is still .NET 3.5)
  * Non-core, high-level functionality has been moved into a new [ServiceStack.Contrib](https://github.com/ServiceStack/ServiceStack.Contrib)

## Breaking Changes
A lot of effort was made to ensure that clients would not be affected i.e. no code-changes should be required. 

As a result of the change to the deployment dlls where previously ServiceStack.dll was an ILMERGED combination of every implementation dll in ServiceStack. You will now need to explicitly reference each dll that you need. 

To help visualize the dependencies between the various components, here is a tree showing which dependencies each project has:

  * [ServiceStack.Text.dll](https://github.com/ServiceStack/ServiceStack.Text)
  * [ServiceStack.Interfaces.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Interfaces)

      * [ServiceStack.Common.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Common)

        * [ServiceStack.dll](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack)
          * [ServiceStack.ServiceInterface.dll](https://github.com/ServiceStack/ServiceStack.Contrib/tree/master/src/ServiceStack.ServiceInterface)

        * [ServiceStack.Redis.dll](https://github.com/ServiceStack/ServiceStack.Redis)
        * [ServiceStack.OrmLite.dll](https://github.com/ServiceStack/ServiceStack.OrmLite)


### Non-core Framework features extracted into new ServiceStack.Contrib project

In the interest of promoting contributions and modifications from the community, the non-core projects of ServiceStack has been extracted into a new user contributed **ServiceStack.Contrib** project site at:

**[[https://github.com/ServiceStack/ServiceStack.Contrib]]**

I invite all ServiceStack users who want to share their generic high-level functionality and useful app-specific classes under this project where the rest of the community can benefit from.


##Service Stack 1.82 Release Notes

### [New HTML5 Report Format Added](https://github.com/ServiceStack/ServiceStack/wiki/HTML5ReportFormat)

The biggest feature added in this release is likely the new HTML5 report format that generates a human-readable HTML view of your web services response when viewing it in a web browser.
Good news is, like the [[ServiceStack-CSV-Format]] it works with your existing webservices as-is, with no configuration or code-changes required.
  
[![HTML5 Report Format](http://servicestack.net/img/HTML5Format.png)](https://github.com/ServiceStack/ServiceStack/wiki/HTML5ReportFormat)

Here are some results of web services created before the newer HTML5 and CSV formats existed:

  * **RedisStackOverflow** [Latest Questions](http://servicestack.net/RedisStackOverflow/questions)
  * **RestMovies** [All Movie listings](http://servicestack.net/ServiceStack.MovieRest/movies)
  * **RestFiles** [Root Directory](http://servicestack.net/RestFiles/files)

Use the **?format=[json|xml|html|csv|jsv]** to toggle and view the same webservice in different formats.

### New ServiceStack.Northwind Example project added

In order to be able to better demonstrate features with a 'real-world' DataSet, a new ServiceStack.Northwind project has been added which inspects the Northwind dataset from an SQLite database.
A live demo is hosted at [[http://servicestack.net/ServiceStack.Northwind/]]. Here are some links below to better demonstrate the new HTML format with a real-world dataset:

#### Nortwind Database REST web services
  * [All Customers](http://servicestack.net/ServiceStack.Northwind/customers) 
  * [Customer Detail](http://servicestack.net/ServiceStack.Northwind/customers/ALFKI)
  * [Customer Orders](http://servicestack.net/ServiceStack.Northwind/customers/ALFKI/orders)


### Improved Caching

ServiceStack has always had its own (i.e. ASP.NET implementation-free) [good support for caching](https://github.com/ServiceStack/ServiceStack/wiki/Caching), though like most un-documented features it is rarely used. The caching has been improved in this version to now support caching of user-defined formats as well. Here is example usage from the new Northwind project:

    public class CachedCustomersService : RestServiceBase<CachedCustomers>
    {
        public ICacheClient CacheClient { get; set; }

        public override object OnGet(CachedCustomers request)
        {
            return base.RequestContext.ToOptimizedResultUsingCache(
                this.CacheClient, "urn:customers", () => {
                    var service = base.ResolveService<CustomersService>();
                        return (CustomersResponse) service.Get(new Customers());
                });
        }
    }

The above code caches the most optimal output based on browser capabilities, i.e. if your browser supports deflate compression (as most do), a deflated, serialized output is cached and written directly on the response stream for subsequent calls. Only if no cache exists will the web service implementation (e.g lambda) be executed, which populates the cache before returning the response.

To see the difference caching provides, here are cached equivalents of the above REST web service calls:

#### Nortwind Database **Cached** REST web services
  * [All Customers](http://servicestack.net/ServiceStack.Northwind/cached/customers) 
  * [Customer Detail](http://servicestack.net/ServiceStack.Northwind/cached/customers/ALFKI)
  * [Customer Orders](http://servicestack.net/ServiceStack.Northwind/cached/customers/ALFKI/orders)


### API Changes

The underlying IHttpRequest (an adapter interface over ASP.NET/HttpListener HTTP Requests) can now be retrieved within your webservice to be able to query the different HTTP Request properties:

    var httpReq = base.RequestContext.Get<IHttpRequest>();
    
Also added is the ability to resolve existing web services (already auto-wired by the IOC) so you can re-use existing web service logic. Here is an example of usage from the Northwind [CustomerDetailsService.cs](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/ServiceStack.Northwind/ServiceStack.Northwind.ServiceInterface/CustomerDetailsService.cs).

    var ordersService = base.ResolveService<OrdersService>();
    var ordersResponse = (OrdersResponse)ordersService.Get(new Orders { CustomerId = customer.Id });


##Service Stack 1.79 Release Notes

### The C#/.NET Sync and Async Service Clients were improved to include: 
  * Enhanced REST functionality and access, now more succinct than ever
  * Uploading of files to ServiceStack web services using **HTTP POST** *multipart/form-data*
  * More robust error handling support handling C# exceptions over REST services 
  * For examples of on how to use the C# REST client API check out the tests in the new REST Files project:
    * [Sync C# client examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/SyncRestClientTests.cs) 
    * [Async C# client examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/AsyncRestClientTests.cs)

## New RestFiles project added to [ServiceStack.Examples](https://github.com/ServiceStack/ServiceStack.Examples/) GitHub project:
#### Live demo available at: [servicestack.net/RestFiles/](http://servicestack.net/RestFiles/)

  * Provides a complete remote file system management over a [REST-ful api](http://servicestack.net/RestFiles/servicestack/metadata) 
  * The complete REST-ful /files web service implementation is only [**1 C# page class**](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.ServiceInterface/FilesService.cs)
  * Includes a pure ajax client to provide a **GitHub-like** file browsing experience, written in only [**1 static HTML page, using only jQuery**](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles/default.htm)
   * [C# integration test examples](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/RestFiles/RestFiles.Tests/) are also included showing how to access this REST-ful api over sync and async C# clients

Read the rest of the [Rest Files README.md](https://github.com/ServiceStack/ServiceStack.Examples/tree/master/src/RestFiles/RestFiles) for a more detailed overview about the project.

##Service Stack 1.78 Release Notes

 * Added more tests and fixed bugs in ServiceStack's new CSV format and Request/Response filters
 * Added new information on the generated web service index, individual web service page now include:
   * REST paths (if any are defined) thanks to [@jakescott](http://twitter.com/jakescott)
   * Included directions to consumers on how to override the HTTP **Accept** header and specify the **format**
   * Now including any System.CompontentModel.**Description** meta information attributed on your Request DTO
   * Preview the new documentation pages on ServiceStack [**Hello**](http://www.servicestack.net/ServiceStack.Hello/servicestack/json/metadata?op=Hello) and [**Movies**](http://www.servicestack.net/ServiceStack.MovieRest/servicestack/xml/metadata?op=Movie) example web service pages.
 * Added [tests to show how to implement Basic Authentication](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/RequestFiltersTests.cs) using the new RequestFilters
 * Changed the httpHandler paths in the Example projects and [created a new Config class](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.WebHost.Endpoints/SupportedHandlerMappings.cs) to store which supported mappings go with which web servers + middleware.
 * Provide a way to register new urls for different ServiceStack handler mappings used, e.g. to register IIS 6.0 urls:

       SetConfig(new EndpointConfig { ServiceEndpointsMetadataConfig = ServiceEndpointsMetadataConfig.GetForIis6ServiceStackAshx() });

##Service Stack 1.77 Release Notes

This release was focused to opening up ServiceStack to better support adding more hooks and extension points where new formats can be added. The CSV format was also added to test these new extension APIs.

## Main features added in this release:

* Added support for the [CSV format](https://github.com/ServiceStack/ServiceStack/wiki/ServiceStack-CSV-Format)
* Enhanced the IContentTypeFilter API to add support for different serialization formats
* Added Request and Response filters so custom code can inspect and modify the incoming [IHttpRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceHost/IHttpRequest.cs) or [IHttpResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceHost/IHttpResponse.cs). 
* Added `Request.Items` so you can share arbitrary data between your filters and web services.
* Added `Request.Cookies` for reading cookies (to avoid retrieving it from HttpRuntime.Current)
* Removed the preceding UTF8 BOM character to ServiceStack's JSON and JSV Serializers. 
* All features above are available on both ASP.NET and HttpListener hosts

### [CSV Format](https://github.com/ServiceStack/ServiceStack/wiki/ServiceStack-CSV-Format)

Using the same tech that makes [ServiceStack's JSV and JSON serializers so fast](http://www.servicestack.net/benchmarks/NorthwindDatabaseRowsSerialization.100000-times.2010-08-17.html) (i.e. no run-time reflection, static delegate caching, etc), should make it the fastest POCO CSV Serializer available for .NET.

The 'CSV' format is the first format added using the new extensions API, which only took the following lines of code:

	//Register the 'text/csv' content-type and serializers (format is inferred from the last part of the content-type)
	this.ContentTypeFilters.Register(ContentType.Csv,
		CsvSerializer.SerializeToStream, CsvSerializer.DeserializeFromStream);

	//Add a response filter to add a 'Content-Disposition' header so browsers treat it as a native .csv file
	this.ResponseFilters.Add((req, res, dto) =>
		{
			if (req.ResponseContentType == ContentType.Csv)
			{
				res.AddHeader(HttpHeaders.ContentDisposition,
					string.Format("attachment;filename={0}.csv", req.OperationName));
			}
		});

With only the code above, the 'CSV' format is now a first-class supported format which means all your existing web services can take advantage of the new format without any config or code changes. Just drop the latest ServiceStack.dlls (v1.77+) and you're good to go! 

Note: there are some limitations on the CSV format and implementation which you can read about on the [ServiceStack CSV Format page](https://github.com/ServiceStack/ServiceStack/wiki/ServiceStack-CSV-Format).

### Request and Response Filters:

The Request filter takes a IHttpRequest, IHttpResponse and the **Request DTO**:
    List<Action<IHttpRequest, IHttpResponse, object>> RequestFilters { get; }

The Response filter takes a IHttpRequest, IHttpResponse and the **Response DTO**:
    List<Action<IHttpRequest, IHttpResponse, object>> ResponseFilters{ get; }

Note: both sets of filters are called before there any output is written to the response stream so you can happily use the filters to authorize and redirect the request. Calling `IHttpResponse.Close()` will close the response stream and stop any further processing of this request.

Feel free to discuss or find more about any of these features at the [Service Stack Google Group](https://groups.google.com/forum/#!forum/servicestack)


[<Wiki Home](https://github.com/ServiceStack/ServiceStack/wiki)
